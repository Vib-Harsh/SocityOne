from fastapi import APIRouter
from .roles import router as roles_router
from .users import router as users_router
from .superuser import router as super_user_router
from .modules import router as modules_router

prefix = f"/api/v1"
api_v1_router = APIRouter()

api_v1_router.include_router(super_user_router, prefix="/administration", tags=["Super Admin"])
api_v1_router.include_router(users_router, prefix=f"{prefix}/users", tags=["Users"])
api_v1_router.include_router(roles_router, prefix=f"{prefix}/roles", tags=["Roles"])
api_v1_router.include_router(modules_router, prefix=f"{prefix}/modules", tags=["Modules"])