from app.core.database import get_db
from fastapi import Depends
from sqlalchemy.orm import Session
from fastapi import APIRouter
from app.api.controllers import superuser_controller
from app.schemas.superuser import SuperRoleLogin

router = APIRouter()

@router.post("/adminLogin", summary="Login With Super Admin credentials", description="Check if super admin is valid or not")
def login_with_super_admin_credentials(loginData: SuperRoleLogin, db: Session = Depends(get_db)):
    return superuser_controller.login_with_super_admin_credentials(db, loginData)