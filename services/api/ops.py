"""Owner-scoped inventory ledger with transactional balance enforcement."""
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, Request
from datetime import datetime, timezone
from sqlalchemy import case, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from .auth import Principal, get_principal
from .database import get_session
from .errors import ApiProblem
from .models import Farm, FarmTask, Field, InventoryTransaction
from .schemas import (
    ApiMeta,
    ApiResponse,
    ErrorResponse,
    InventoryBalanceRead,
    InventoryTransactionCreate,
    InventoryTransactionRead,
    FarmTaskCreate,
    FarmTaskPatch,
    FarmTaskRead,
    TaskPriority,
    TaskStatus,
)

router = APIRouter(
    prefix="/api/v1/ops",
    tags=["NEXFIELD Ops"],
    responses={status: {"model": ErrorResponse} for status in (401, 404, 409, 422, 503)},
)
User = Annotated[Principal, Depends(get_principal)]
Session = Annotated[AsyncSession, Depends(get_session)]


async def owned_farm(
    session: AsyncSession,
    farm_id: UUID,
    user: Principal,
    *,
    lock: bool = False,
) -> Farm:
    statement = select(Farm).where(
        Farm.id == farm_id,
        Farm.owner_id == user.user_id,
        Farm.archived_at.is_(None),
    )
    if lock:
        statement = statement.with_for_update()
    farm = await session.scalar(statement)
    if farm is None:
        raise ApiProblem(404, "FARM_NOT_FOUND", "Farm not found")
    return farm


def metadata(request: Request) -> ApiMeta:
    return ApiMeta(request_id=request.state.request_id)


def task_payload(task: FarmTask) -> dict:
    return {
        "id": task.id,
        "farm_id": task.farm_id,
        "field_id": task.field_id,
        "title": task.title,
        "description": task.description,
        "category": task.category,
        "priority": task.priority,
        "status": task.status,
        "assigned_to_user_id": task.assigned_to_user_id,
        "assigned_to_name": task.assigned_to_name,
        "due_date": task.due_date,
        "completed_at": task.completed_at,
        "cost_estimate_inr": task.cost_estimate_inr,
        "actual_cost_inr": task.actual_cost_inr,
        "created_at": task.created_at,
        "updated_at": task.updated_at,
    }


@router.post(
    "/tasks",
    status_code=201,
    response_model=ApiResponse[FarmTaskRead],
    response_model_exclude_none=True,
)
async def create_task(
    farm_id: Annotated[UUID, Query(alias="farmId")],
    body: FarmTaskCreate,
    request: Request,
    user: User,
    session: Session,
) -> ApiResponse[FarmTaskRead]:
    async with session.begin():
        await owned_farm(session, farm_id, user)
        if body.field_id is not None:
            field = await session.scalar(
                select(Field).where(Field.id == body.field_id, Field.farm_id == farm_id)
            )
            if field is None:
                raise ApiProblem(404, "FIELD_NOT_FOUND", "Field not found")
        task = FarmTask(farm_id=farm_id, **body.model_dump(mode="python"))
        session.add(task)
        await session.flush()
        await session.refresh(task)
        result = FarmTaskRead.model_validate(task_payload(task))
    return ApiResponse(data=result, meta=metadata(request))


@router.get(
    "/tasks",
    response_model=ApiResponse[list[FarmTaskRead]],
    response_model_exclude_none=True,
)
async def list_tasks(
    farm_id: Annotated[UUID, Query(alias="farmId")],
    request: Request,
    user: User,
    session: Session,
    status: TaskStatus | None = None,
    priority: TaskPriority | None = None,
) -> ApiResponse[list[FarmTaskRead]]:
    await owned_farm(session, farm_id, user)
    statement = select(FarmTask).where(FarmTask.farm_id == farm_id)
    if status is not None:
        statement = statement.where(FarmTask.status == status)
    if priority is not None:
        statement = statement.where(FarmTask.priority == priority)
    tasks = await session.scalars(statement.order_by(FarmTask.due_date, FarmTask.id))
    return ApiResponse(
        data=[FarmTaskRead.model_validate(task_payload(task)) for task in tasks],
        meta=metadata(request),
    )


@router.patch(
    "/tasks/{task_id}",
    response_model=ApiResponse[FarmTaskRead],
    response_model_exclude_none=True,
)
async def update_task(
    task_id: UUID,
    body: FarmTaskPatch,
    request: Request,
    user: User,
    session: Session,
) -> ApiResponse[FarmTaskRead]:
    async with session.begin():
        task = await session.scalar(
            select(FarmTask)
            .join(Farm, Farm.id == FarmTask.farm_id)
            .where(
                FarmTask.id == task_id,
                Farm.owner_id == user.user_id,
                Farm.archived_at.is_(None),
            )
            .with_for_update()
        )
        if task is None:
            raise ApiProblem(404, "TASK_NOT_FOUND", "Task not found")
        if body.status is not None:
            allowed = {
                "todo": {"in_progress", "cancelled"},
                "in_progress": {"completed", "cancelled"},
                "completed": set(),
                "cancelled": set(),
            }
            if body.status != task.status and body.status not in allowed[task.status]:
                raise ApiProblem(409, "INVALID_TASK_TRANSITION", "Task status transition is not allowed")
        for key, value in body.model_dump(mode="python", exclude_unset=True).items():
            setattr(task, key, value)
        if body.status == "completed":
            task.completed_at = datetime.now(timezone.utc)
        elif body.status is not None and body.status != "completed":
            task.completed_at = None
        await session.flush()
        await session.refresh(task)
        result = FarmTaskRead.model_validate(task_payload(task))
    return ApiResponse(data=result, meta=metadata(request))


@router.post(
    "/inventory/transactions",
    status_code=201,
    response_model=ApiResponse[InventoryTransactionRead],
    response_model_exclude_none=True,
)
async def create_inventory_transaction(
    farm_id: Annotated[UUID, Query(alias="farmId")],
    body: InventoryTransactionCreate,
    request: Request,
    user: User,
    session: Session,
) -> ApiResponse[InventoryTransactionRead]:
    async with session.begin():
        await owned_farm(session, farm_id, user, lock=True)
        if body.field_id is not None:
            field = await session.scalar(
                select(Field)
                .join(Farm, Farm.id == Field.farm_id)
                .where(
                    Field.id == body.field_id,
                    Field.farm_id == farm_id,
                    Farm.owner_id == user.user_id,
                    Farm.archived_at.is_(None),
                )
            )
            if field is None:
                raise ApiProblem(404, "FIELD_NOT_FOUND", "Field not found")

        existing = await session.scalar(
            select(InventoryTransaction).where(
                InventoryTransaction.farm_id == farm_id,
                InventoryTransaction.idempotency_key == body.idempotency_key,
            )
        )
        if existing is not None:
            raise ApiProblem(409, "DUPLICATE_TRANSACTION", "This inventory transaction was already recorded")

        balance = await session.scalar(
            select(func.coalesce(func.sum(
                case(
                    (InventoryTransaction.transaction_type.in_(["purchase", "return"]),
                     InventoryTransaction.quantity),
                    else_=-InventoryTransaction.quantity,
                )
            ), 0)).where(
                InventoryTransaction.farm_id == farm_id,
                InventoryTransaction.item_name == body.item_name,
                InventoryTransaction.unit == body.unit,
            )
        )
        current_balance = float(balance or 0)
        change = body.quantity if body.transaction_type in {"purchase", "return"} else -body.quantity
        next_balance = current_balance + change
        if next_balance < 0:
            raise ApiProblem(409, "INSUFFICIENT_STOCK", "Inventory balance cannot become negative")

        transaction = InventoryTransaction(
            farm_id=farm_id,
            **body.model_dump(mode="python", by_alias=False),
            total_amount_inr=body.quantity * body.unit_price_inr,
            balance_after_quantity=next_balance,
        )
        session.add(transaction)
        await session.flush()
        await session.refresh(transaction)
        result = InventoryTransactionRead.model_validate(inventory_transaction_payload(transaction))
    return ApiResponse(data=result, meta=metadata(request))


@router.get(
    "/inventory",
    response_model=ApiResponse[list[InventoryBalanceRead]],
    response_model_exclude_none=True,
)
async def inventory(
    farm_id: Annotated[UUID, Query(alias="farmId")],
    request: Request,
    user: User,
    session: Session,
) -> ApiResponse[list[InventoryBalanceRead]]:
    await owned_farm(session, farm_id, user)
    balance_change = case(
        (InventoryTransaction.transaction_type.in_(["purchase", "return"]),
         InventoryTransaction.quantity),
        else_=-InventoryTransaction.quantity,
    )
    rows = await session.execute(
        select(
            InventoryTransaction.item_type,
            InventoryTransaction.item_name,
            InventoryTransaction.unit,
            func.sum(balance_change).label("balance_quantity"),
            func.sum(case(
                (InventoryTransaction.transaction_type == "purchase",
                 InventoryTransaction.total_amount_inr),
                else_=0,
            )).label("total_purchased_amount_inr"),
            func.max(InventoryTransaction.transaction_date).label("last_transaction_date"),
        )
        .where(InventoryTransaction.farm_id == farm_id)
        .group_by(
            InventoryTransaction.item_type,
            InventoryTransaction.item_name,
            InventoryTransaction.unit,
        )
        .order_by(InventoryTransaction.item_name)
    )
    data = [InventoryBalanceRead.model_validate(row._mapping) for row in rows]
    return ApiResponse(data=data, meta=metadata(request))


def inventory_transaction_payload(transaction: InventoryTransaction) -> dict:
    return {
        "id": transaction.id,
        "farm_id": transaction.farm_id,
        "field_id": transaction.field_id,
        "item_type": transaction.item_type,
        "item_name": transaction.item_name,
        "batch_number": transaction.batch_number,
        "transaction_type": transaction.transaction_type,
        "quantity": transaction.quantity,
        "unit": transaction.unit,
        "unit_price_inr": transaction.unit_price_inr,
        "total_amount_inr": transaction.total_amount_inr,
        "balance_after_quantity": transaction.balance_after_quantity,
        "supplier_or_vendor": transaction.supplier_or_vendor,
        "date": transaction.transaction_date,
        "created_at": transaction.created_at,
    }
