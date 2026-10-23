"""Backend configuration; no development authentication bypasses."""
from pathlib import Path
from urllib.parse import urlsplit

from pydantic import SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy.engine import make_url


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=Path(__file__).with_name(".env"), extra="ignore")
    database_url: SecretStr | None = None
    supabase_url: str | None = None
    supabase_anon_key: SecretStr | None = None
    cors_origins: list[str] = ["http://localhost:3000"]

    @field_validator("database_url")
    @classmethod
    def postgres_only(cls, value: SecretStr | None) -> SecretStr | None:
        if value is not None:
            try:
                url = make_url(value.get_secret_value())
                valid = url.drivername == "postgresql+asyncpg" and bool(url.database)
            except Exception:
                valid = False
            if not valid:
                raise ValueError("DATABASE_URL must use postgresql+asyncpg and name a database")
        return value

    @field_validator("supabase_url")
    @classmethod
    def secure_auth_origin(cls, value: str | None) -> str | None:
        if value is None:
            return None
        url = urlsplit(value)
        local = url.hostname in {"localhost", "127.0.0.1", "::1"}
        if (not url.hostname or (url.scheme != "https" and not (url.scheme == "http" and local))
                or url.username or url.password or url.query or url.fragment or url.path not in {"", "/"}):
            raise ValueError("SUPABASE_URL must be an HTTPS origin (HTTP allowed for localhost)")
        return value.rstrip("/")

    @field_validator("cors_origins")
    @classmethod
    def explicit_origins(cls, values: list[str]) -> list[str]:
        if "*" in values:
            raise ValueError("CORS_ORIGINS must list explicit frontend origins")
        return values
