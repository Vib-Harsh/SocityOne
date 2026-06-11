import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings
from app.utils.token_management import generateToken
from app.core.database import SessionLocal
from app.models.role import Role
from app.models.user import User

client = TestClient(app)

@pytest.fixture(autouse=True)
def cleanup_db():
    db = SessionLocal()
    try:
        db.query(User).delete()
        db.query(Role).delete()
        db.commit()
    finally:
        db.close()

def get_auth_headers():
    token = generateToken({"name": "Admin User", "email": "admin@example.com", "role_id": 1})
    return {
        "api_key": settings.API_KEY,
        "application_key": settings.APPLICATION_KEY,
        "Authorization": f"Bearer {token}"
    }

def create_mock_role(name="Test Role") -> int:
    db = SessionLocal()
    try:
        role = Role(name=name)
        db.add(role)
        db.commit()
        db.refresh(role)
        return role.id
    finally:
        db.close()

def test_create_user_success():
    role_id = create_mock_role("Admin")
    headers = get_auth_headers()
    payload = {
        "name": "John Doe",
        "email": "john@example.com",
        "password": "securepassword123",
        "role_id": role_id
    }
    response = client.post("/api/v1/users/", json=payload, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "John Doe"
    assert data["email"] == "john@example.com"
    assert data["role"] == "Admin"

def test_create_user_invalid_role():
    headers = get_auth_headers()
    payload = {
        "name": "John Doe",
        "email": "john@example.com",
        "password": "securepassword123",
        "role_id": 9999  # Invalid role ID
    }
    response = client.post("/api/v1/users/", json=payload, headers=headers)
    assert response.status_code == 400
    assert "Ensure that role_id 9999 is valid" in response.json()["detail"]

def test_create_user_duplicate_email():
    role_id = create_mock_role("User")
    headers = get_auth_headers()
    payload = {
        "name": "John Doe",
        "email": "john@example.com",
        "password": "securepassword123",
        "role_id": role_id
    }
    # Create once
    response = client.post("/api/v1/users/", json=payload, headers=headers)
    assert response.status_code == 201
    
    # Create twice with same email
    response2 = client.post("/api/v1/users/", json=payload, headers=headers)
    assert response2.status_code == 400
    assert "already registered" in response2.json()["detail"]

def test_get_user_by_id_success():
    role_id = create_mock_role()
    headers = get_auth_headers()
    payload = {
        "name": "Jane Doe",
        "email": "jane@example.com",
        "password": "password123",
        "role_id": role_id
    }
    create_res = client.post("/api/v1/users/", json=payload, headers=headers)
    user_id = create_res.json()["id"]

    response = client.get(f"/api/v1/users/{user_id}", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Jane Doe"
    assert data["email"] == "jane@example.com"

def test_get_user_by_id_not_found():
    headers = get_auth_headers()
    response = client.get("/api/v1/users/9999", headers=headers)
    assert response.status_code == 404
    assert "not found" in response.json()["detail"]

def test_list_users_search_and_sort():
    role_id = create_mock_role()
    headers = get_auth_headers()
    
    # Create two users
    client.post("/api/v1/users/", json={"name": "Alice", "email": "alice@example.com", "password": "pass", "role_id": role_id}, headers=headers)
    client.post("/api/v1/users/", json={"name": "Bob", "email": "bob@example.com", "password": "pass", "role_id": role_id}, headers=headers)

    # List users
    response = client.get("/api/v1/users/?search=Alice", headers=headers)
    assert response.status_code == 200
    res_data = response.json()
    assert len(res_data["data"]) == 1
    assert res_data["data"][0]["name"] == "Alice"

    # List sorted
    response_sort = client.get("/api/v1/users/?sort_by=name&sort_order=DESC", headers=headers)
    assert response_sort.status_code == 200
    data_sort = response_sort.json()["data"]
    assert len(data_sort) == 2
    assert data_sort[0]["name"] == "Bob"
    assert data_sort[1]["name"] == "Alice"

def test_update_user_success():
    role_id = create_mock_role("Original Role")
    new_role_id = create_mock_role("New Role")
    headers = get_auth_headers()
    
    # Create user
    create_res = client.post("/api/v1/users/", json={"name": "Charlie", "email": "charlie@example.com", "password": "pass", "role_id": role_id}, headers=headers)
    user_id = create_res.json()["id"]

    # Update
    update_payload = {
        "name": "Charlie Updated",
        "email": "charlie_new@example.com",
        "role_id": new_role_id
    }
    response = client.put(f"/api/v1/users/{user_id}", json=update_payload, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Charlie Updated"
    assert data["email"] == "charlie_new@example.com"
    assert data["role_id"] == new_role_id

def test_update_user_invalid_role():
    role_id = create_mock_role()
    headers = get_auth_headers()
    
    create_res = client.post("/api/v1/users/", json={"name": "Charlie", "email": "charlie@example.com", "password": "pass", "role_id": role_id}, headers=headers)
    user_id = create_res.json()["id"]

    response = client.put(f"/api/v1/users/{user_id}", json={"role_id": 9999}, headers=headers)
    assert response.status_code == 404
    assert "role_id is invalid" in response.json()["detail"]

def test_update_user_duplicate_email():
    role_id = create_mock_role()
    headers = get_auth_headers()
    
    # Create user 1 and user 2
    client.post("/api/v1/users/", json={"name": "User One", "email": "one@example.com", "password": "pass", "role_id": role_id}, headers=headers)
    create_res2 = client.post("/api/v1/users/", json={"name": "User Two", "email": "two@example.com", "password": "pass", "role_id": role_id}, headers=headers)
    user2_id = create_res2.json()["id"]

    # Update user 2 to use user 1's email
    response = client.put(f"/api/v1/users/{user2_id}", json={"email": "one@example.com"}, headers=headers)
    assert response.status_code == 400
    assert "already registered by another user" in response.json()["detail"]

def test_delete_user_success():
    role_id = create_mock_role()
    headers = get_auth_headers()
    
    # Create user
    create_res = client.post("/api/v1/users/", json={"name": "Dave", "email": "dave@example.com", "password": "pass", "role_id": role_id}, headers=headers)
    user_id = create_res.json()["id"]

    # Delete user
    response = client.delete(f"/api/v1/users/{user_id}", headers=headers)
    assert response.status_code == 200
    assert "deleted successfully" in response.json()["message"]

    # Retrieve should return the user (since get-by-id does not filter out deleted status)
    response_get = client.get(f"/api/v1/users/{user_id}", headers=headers)
    assert response_get.status_code == 200

    # List users should not include the deleted user
    list_res = client.get("/api/v1/users/", headers=headers)
    users_list = list_res.json()["data"]
    assert all(u["id"] != user_id for u in users_list)
