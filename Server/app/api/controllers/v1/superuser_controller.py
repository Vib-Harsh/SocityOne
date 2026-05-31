from app.schemas.superuser import SuperRoleLogin
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.api.services import role_service
from app.utils.logger import logger
from app.core.config import settings
from app.utils import generateToken

def login_with_super_admin_credentials(db: Session, loginData: SuperRoleLogin):
    """ Check shared credentials are valid for super admin, With static values """
    email = settings.SUPER_ADMIN_EMAIL
    password = settings.SUPER_ADMIN_PASSWORD
    if email != loginData.email or password != loginData.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    userInfo = {
        "name": "Super Admin",
        "role_id": 0,
        "email": loginData.email
    }
    token = generateToken(userInfo)
    return {
        "message": "Login Successful",
        "token": token,
        "user_info": userInfo 
    }