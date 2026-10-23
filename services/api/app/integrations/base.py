import httpx
from typing import Optional, Dict, Any
from pydantic import BaseModel

class IntegrationError(Exception):
    """Base exception for all integration errors."""
    pass

class DataUnavailableError(IntegrationError):
    """Raised when the requested data is not available from the source."""
    pass

class RateLimitError(IntegrationError):
    """Raised when the API rate limit is exceeded."""
    pass

class ConfigurationError(IntegrationError):
    """Raised when the adapter is not properly configured."""
    pass

class BaseAdapter:
    """
    Base class for external data adapters.
    Provides common HTTP client setup, timeout handling, and error wrapping.
    """
    def __init__(self, base_url: str, timeout: int = 10, headers: Optional[Dict[str, str]] = None):
        if not base_url:
            raise ConfigurationError("Base URL must be provided.")

        self.base_url = base_url
        self.timeout = timeout
        self.headers = headers or {}

        self.client = httpx.AsyncClient(
            base_url=self.base_url,
            timeout=httpx.Timeout(self.timeout),
            headers=self.headers
        )

    async def close(self):
        """Close the underlying HTTP client."""
        await self.client.aclose()

    async def _get(self, endpoint: str, params: Optional[Dict[str, Any]] = None) -> httpx.Response:
        """
        Wrapper around HTTPX GET to handle common exceptions.
        """
        try:
            response = await self.client.get(endpoint, params=params)

            if response.status_code == 404:
                raise DataUnavailableError(f"Data not found at {endpoint}")
            if response.status_code == 429:
                raise RateLimitError("Rate limit exceeded.")

            response.raise_for_status()
            return response

        except httpx.TimeoutException as e:
            raise IntegrationError(f"Request timeout: {e}")
        except httpx.RequestError as e:
            raise IntegrationError(f"Request failed: {e}")
        except httpx.HTTPStatusError as e:
            raise IntegrationError(f"HTTP error {e.response.status_code}: {e.response.text}")
