"""Owner-scoped Data Center ingestion endpoint for CSV/JSON/GeoJSON records."""
from datetime import date, datetime, timezone
from typing import Annotated, Any, Literal
from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .auth import Principal, get_principal
from .database import get_session
from .errors import ApiProblem
from .farms import owned_farm
from .models import Farm, FarmExpense, FarmTask, Field, Observation
from .schemas import ApiMeta, ApiResponse, ContractModel, ErrorResponse

router = APIRouter(
    prefix="/api/v1/farms/{farm_id}/import",
    tags=["Data Center"],
    responses={status: {"model": ErrorResponse} for status in (401, 404, 409, 422, 503)},
)
User = Annotated[Principal, Depends(get_principal)]
Session = Annotated[AsyncSession, Depends(get_session)]

ImportCategory = Literal["sensors", "expenses", "tasks", "fields"]


class ImportRequest(ContractModel):
    category: ImportCategory
    records: list[dict[str, Any]]


class ImportSummary(ContractModel):
    category: ImportCategory
    imported_count: int
    failed_count: int
    errors: list[str]


def parse_datetime(val: Any) -> datetime:
    if isinstance(val, datetime):
        if val.tzinfo is None:
            return val.replace(tzinfo=timezone.utc)
        return val
    if isinstance(val, str):
        # Try isoformat
        try:
            dt = datetime.fromisoformat(val.replace("Z", "+00:00"))
            if dt.tzinfo is None:
                return dt.replace(tzinfo=timezone.utc)
            return dt
        except ValueError:
            pass
        # Try formats
        for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d %H:%M", "%Y-%m-%d", "%d/%m/%Y %H:%M", "%d/%m/%Y"):
            try:
                dt = datetime.strptime(val, fmt)
                return dt.replace(tzinfo=timezone.utc)
            except ValueError:
                pass
    return datetime.now(timezone.utc)


def parse_date(val: Any) -> date:
    if isinstance(val, date) and not isinstance(val, datetime):
        return val
    if isinstance(val, datetime):
        return val.date()
    if isinstance(val, str):
        try:
            return date.fromisoformat(val)
        except ValueError:
            pass
        for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%Y/%m/%d"):
            try:
                return datetime.strptime(val, fmt).date()
            except ValueError:
                pass
    return date.today()


@router.post("", status_code=200, response_model=ApiResponse[ImportSummary], response_model_exclude_none=True)
async def import_data(
    farm_id: UUID,
    body: ImportRequest,
    request: Request,
    user: User,
    session: Session,
) -> ApiResponse[ImportSummary]:
    async with session.begin():
        farm = await owned_farm(session, farm_id, user, lock=True)

        # Get existing fields for this farm
        existing_fields = list(await session.scalars(select(Field).where(Field.farm_id == farm_id)))
        default_field = existing_fields[0] if existing_fields else None

        imported = 0
        failed = 0
        errors: list[str] = []

        if body.category == "sensors":
            if not default_field:
                # If no field exists yet, create a default field parcel so telemetry has a home
                default_field = Field(
                    farm_id=farm_id,
                    name=f"{farm.name} - Parcel A",
                    code="F-101",
                    area_hectares=min(farm.total_area_hectares, 1.0),
                    soil_metrics={
                        "ph": 6.8,
                        "organicCarbonPercent": 0.75,
                        "nitrogenKgPerHa": 140.0,
                        "phosphorusKgPerHa": 35.0,
                        "potassiumKgPerHa": 210.0,
                        "electricalConductivityDsM": 0.45,
                        "moisturePercent": 38.0,
                        "lastSampledDate": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                    },
                )
                session.add(default_field)
                await session.flush()
                await session.refresh(default_field)

            obs_to_add = []
            for idx, row in enumerate(body.records):
                try:
                    dt = parse_datetime(row.get("timestamp") or row.get("date") or row.get("observed_at"))
                    metrics: dict[str, Any] = {}
                    for k, v in row.items():
                        if k in ("timestamp", "date", "observed_at", "field_id", "notes", "type"):
                            continue
                        try:
                            metrics[k] = float(v)
                        except (ValueError, TypeError):
                            metrics[k] = str(v)

                    obs = Observation(
                        field_id=default_field.id,
                        observation_type="iot_sensor_telemetry",
                        observed_at=dt,
                        metrics=metrics,
                        notes=str(row.get("notes") or f"Ingested from Data Center batch row #{idx + 1}"),
                    )
                    obs_to_add.append(obs)
                    imported += 1
                except Exception as ex:
                    failed += 1
                    errors.append(f"Row #{idx + 1}: {str(ex)}")
            if obs_to_add:
                session.add_all(obs_to_add)

        elif body.category == "expenses":
            valid_categories = {
                "labor", "seeds", "fertilizer", "pesticide", "irrigation",
                "equipment", "fuel", "transport", "storage", "land_rent", "other"
            }
            expenses_to_add = []
            for idx, row in enumerate(body.records):
                try:
                    raw_cat = str(row.get("category", "other")).lower().strip().replace(" ", "_")
                    cat = raw_cat if raw_cat in valid_categories else "other"
                    amount = float(row.get("amount_inr") or row.get("amount") or 0)
                    if amount <= 0:
                        failed += 1
                        errors.append(f"Row #{idx + 1}: Amount must be positive")
                        continue

                    exp_date = parse_date(row.get("expense_date") or row.get("date"))
                    desc = str(row.get("description") or row.get("title") or f"Expense row #{idx + 1}").strip()
                    vendor = row.get("vendor") or row.get("supplier")
                    idem_key = str(row.get("idempotency_key") or f"import-{farm_id}-{idx}-{uuid4().hex[:8]}")

                    expense = FarmExpense(
                        farm_id=farm_id,
                        field_id=default_field.id if default_field else None,
                        category=cat,
                        description=desc,
                        amount_inr=amount,
                        vendor=str(vendor) if vendor else None,
                        expense_date=exp_date,
                        idempotency_key=idem_key,
                    )
                    expenses_to_add.append(expense)
                    imported += 1
                except Exception as ex:
                    failed += 1
                    errors.append(f"Row #{idx + 1}: {str(ex)}")
            if expenses_to_add:
                session.add_all(expenses_to_add)

        elif body.category == "tasks":
            valid_categories = {
                "irrigation", "fertilization", "spraying_pest_control",
                "crop_scouting", "harvesting", "equipment_maintenance", "soil_testing"
            }
            valid_priorities = {"low", "medium", "high", "urgent"}
            tasks_to_add = []
            for idx, row in enumerate(body.records):
                try:
                    title = str(row.get("title") or row.get("name") or f"Imported Task #{idx + 1}").strip()
                    raw_cat = str(row.get("category", "crop_scouting")).lower().strip().replace(" ", "_")
                    cat = raw_cat if raw_cat in valid_categories else "crop_scouting"
                    raw_pri = str(row.get("priority", "medium")).lower().strip()
                    priority = raw_pri if raw_pri in valid_priorities else "medium"
                    due = parse_date(row.get("due_date") or row.get("date"))

                    task = FarmTask(
                        farm_id=farm_id,
                        field_id=default_field.id if default_field else None,
                        title=title,
                        description=str(row.get("description") or "").strip() or None,
                        category=cat,
                        priority=priority,
                        status="todo",
                        due_date=due,
                    )
                    tasks_to_add.append(task)
                    imported += 1
                except Exception as ex:
                    failed += 1
                    errors.append(f"Row #{idx + 1}: {str(ex)}")
            if tasks_to_add:
                session.add_all(tasks_to_add)

        elif body.category == "fields":
            fields_to_add = []
            for idx, row in enumerate(body.records):
                try:
                    name = str(row.get("name") or row.get("field_name") or f"Field {len(existing_fields) + idx + 1}").strip()
                    code = str(row.get("code") or f"F-{100 + len(existing_fields) + idx + 1}").strip()
                    area = float(row.get("area_hectares") or row.get("area") or 1.0)
                    if area <= 0:
                        failed += 1
                        errors.append(f"Row #{idx + 1}: Area must be positive")
                        continue

                    coords = row.get("polygon_coordinates") or row.get("coordinates")
                    field = Field(
                        farm_id=farm_id,
                        name=name,
                        code=code,
                        area_hectares=area,
                        soil_metrics={
                            "ph": float(row.get("ph") or 6.8),
                            "organicCarbonPercent": float(row.get("organic_carbon") or 0.75),
                            "nitrogenKgPerHa": float(row.get("nitrogen") or 140.0),
                            "phosphorusKgPerHa": float(row.get("phosphorus") or 35.0),
                            "potassiumKgPerHa": float(row.get("potassium") or 210.0),
                            "electricalConductivityDsM": float(row.get("ec") or 0.45),
                            "moisturePercent": float(row.get("moisture") or 38.0),
                            "lastSampledDate": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                        },
                        polygon_coordinates=coords if isinstance(coords, list) else None,
                    )
                    fields_to_add.append(field)
                    imported += 1
                except Exception as ex:
                    failed += 1
                    errors.append(f"Row #{idx + 1}: {str(ex)}")

            if fields_to_add:
                session.add_all(fields_to_add)

        await session.flush()

    return ApiResponse(
        data=ImportSummary(
            category=body.category,
            imported_count=imported,
            failed_count=failed,
            errors=errors[:20],
        ),
        meta=ApiMeta(request_id=request.state.request_id),
    )
