from fastapi import APIRouter
from .roles import router as roles_router
from .users import router as users_router
from .superuser import router as super_user_router

api_v1_router = APIRouter()


api_v1_router.include_router(super_user_router, prefix="/administration", tags=["Super Admin"])
api_v1_router.include_router(roles_router, prefix="/roles", tags=["Roles"])
api_v1_router.include_router(users_router, prefix="/users", tags=["Users"])