from collections.abc import AsyncIterator

from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from .config import Settings
from .errors import ApiProblem


class Database:
    def __init__(self, settings: Settings) -> None:
        self.engine = (
            create_async_engine(settings.database_url.get_secret_value(), pool_pre_ping=True,
                                connect_args={"timeout": 5, "command_timeout": 15})
            if settings.database_url else None
        )
        self.sessions = async_sessionmaker(self.engine, expire_on_commit=False) if self.engine else None

    async def close(self) -> None:
        if self.engine is not None:
            await self.engine.dispose()


async def get_session(request: Request) -> AsyncIterator[AsyncSession]:
    database: Database = request.app.state.database
    if database.sessions is None:
        raise ApiProblem(503, "DATABASE_UNAVAILABLE", "Database is not configured")
    async with database.sessions() as session:
        # Write services commit before producing a successful response.
        yield session
