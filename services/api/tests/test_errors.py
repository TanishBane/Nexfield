import json
import pytest
from unittest.mock import MagicMock
from fastapi import Request

from services.api.errors import problem_response

@pytest.fixture
def mock_request():
    request = MagicMock(spec=Request)
    request.state.request_id = "test-req-123"
    return request

def test_problem_response_basic(mock_request):
    response = problem_response(
        request=mock_request,
        status=400,
        code="BAD_REQUEST",
        message="Invalid input"
    )

    assert response.status_code == 400
    assert "WWW-Authenticate" not in response.headers

    body = json.loads(response.body)
    assert body["success"] is False
    assert body["data"] is None
    assert body["error"]["code"] == "BAD_REQUEST"
    assert body["error"]["message"] == "Invalid input"
    assert "details" not in body["error"]
    assert body["meta"]["requestId"] == "test-req-123"
    assert "pagination" not in body["meta"]

def test_problem_response_with_details(mock_request):
    details = [{"location": ["body", "field"], "message": "Field required", "type": "value_error.missing"}]
    response = problem_response(
        request=mock_request,
        status=422,
        code="VALIDATION_ERROR",
        message="Validation failed",
        details=details
    )

    assert response.status_code == 422

    body = json.loads(response.body)
    assert body["error"]["code"] == "VALIDATION_ERROR"
    assert body["error"]["details"] == details

def test_problem_response_401_unauthorized(mock_request):
    response = problem_response(
        request=mock_request,
        status=401,
        code="UNAUTHORIZED",
        message="Authentication required"
    )

    assert response.status_code == 401
    assert response.headers["WWW-Authenticate"] == "Bearer"

    body = json.loads(response.body)
    assert body["error"]["code"] == "UNAUTHORIZED"

def test_problem_response_missing_request_id():
    request = MagicMock(spec=Request)
    # Don't set request.state.request_id to test fallback
    del request.state.request_id

    response = problem_response(
        request=request,
        status=500,
        code="INTERNAL_ERROR",
        message="Server error"
    )

    body = json.loads(response.body)
    assert body["meta"]["requestId"] == "unknown"
