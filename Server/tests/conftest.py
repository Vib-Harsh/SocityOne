import pytest
from app.core.database import SessionLocal
from app.models.user import User
from app.models.role import Role
from app.models.permission import Permission
from app.models.module import Module
from app.utils.token_management import generateToken
from app.core.config import settings
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture(scope="session")
def client():
    return TestClient(app)

@pytest.fixture(autouse=True)
def cleanup_db():
    db = SessionLocal()
    try:
        db.query(User).delete()
        db.query(Permission).delete()
        db.query(Role).delete()
        db.query(Module).delete()
        db.commit()
    finally:
        db.close()

@pytest.fixture
def auth_headers():
    token = generateToken({"name": "Admin User", "email": "admin@example.com", "role_id": 1})
    return {
        "api_key": settings.API_KEY,
        "application_key": settings.APPLICATION_KEY,
        "Authorization": f"Bearer {token}"
    }
