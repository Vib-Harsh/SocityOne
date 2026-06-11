import pytest
import jwt
import datetime
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings
from app.utils.token_management import generateToken
from unittest.mock import patch

client = TestClient(app)

@pytest.fixture(autouse=True)
def mock_list_users():
    with patch("app.api.routes.v1.users.user_controller.list_users") as mock:
        mock.return_value = [{"id": 1, "name": "Test User"}]
        yield mock

# Helper to generate headers
def get_headers(api_key=None, app_key=None, token=None):
    headers = {}
    if api_key is not None:
        headers["api_key"] = api_key
    if app_key is not None:
        headers["application_key"] = app_key
    if token is not None:
        headers["Authorization"] = f"Bearer {token}"
    return headers

def test_health_no_headers():
    response = client.get("/health/")
    assert response.status_code == 401
    assert response.json()["detail"] == "Unauthorized Access"

def test_health_missing_app_key():
    headers = get_headers(api_key=settings.API_KEY)
    response = client.get("/health/", headers=headers)
    assert response.status_code == 401
    assert response.json()["detail"] == "Unauthorized Application"

def test_health_invalid_api_key():
    headers = get_headers(api_key="wrong_api_key", app_key=settings.APPLICATION_KEY)
    response = client.get("/health/", headers=headers)
    assert response.status_code == 403
    assert response.json()["detail"] == "Access Denied"

def test_health_invalid_app_key():
    headers = get_headers(api_key=settings.API_KEY, app_key="wrong_app_key")
    response = client.get("/health/", headers=headers)
    assert response.status_code == 403
    assert response.json()["detail"] == "Application Access Denied"

def test_health_valid_keys():
    headers = get_headers(api_key=settings.API_KEY, app_key=settings.APPLICATION_KEY)
    response = client.get("/health/", headers=headers)
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_api_missing_token():
    headers = get_headers(api_key=settings.API_KEY, app_key=settings.APPLICATION_KEY)
    response = client.get("/api/v1/users/", headers=headers)
    assert response.status_code == 401
    assert response.json()["detail"] == "Token is missing"

def test_api_invalid_token():
    headers = get_headers(api_key=settings.API_KEY, app_key=settings.APPLICATION_KEY, token="invalidtoken")
    response = client.get("/api/v1/users/", headers=headers)
    assert response.status_code == 401
    assert "Invalid token" in response.json()["detail"]

def test_api_valid_token():
    token = generateToken({"name": "Test User", "email": "test@example.com", "role_id": 1})
    headers = get_headers(api_key=settings.API_KEY, app_key=settings.APPLICATION_KEY, token=token)
    response = client.get("/api/v1/users/", headers=headers)
    
    assert response.status_code == 200
    assert response.json() == [{"id": 1, "name": "Test User"}]

def test_api_expired_token_recreation():
    # Generate an expired token
    payload = {
        "name": "Test User", 
        "email": "test@example.com", 
        "role_id": 1,
        "exp": datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=1)
    }
    token = jwt.encode(payload, settings.TOKEN_SECRET_KEY, algorithm="HS256")
    
    headers = get_headers(api_key=settings.API_KEY, app_key=settings.APPLICATION_KEY, token=token)
    response = client.get("/api/v1/users/", headers=headers)
    
    assert response.status_code == 200
    assert response.json() == [{"id": 1, "name": "Test User"}]
    
    # Assert that new token was generated and returned in headers
    assert "new-token" in response.headers
    assert "X-New-Token" in response.headers
    assert "Access-Control-Expose-Headers" in response.headers
    
    # Decode and verify the new token is valid
    new_token = response.headers["new-token"]
    decoded = jwt.decode(new_token, settings.TOKEN_SECRET_KEY, algorithms=["HS256"])
    assert decoded["name"] == "Test User"
    assert decoded["email"] == "test@example.com"
