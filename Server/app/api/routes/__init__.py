from fastapi import APIRouter, Depends
from app.api.routes import health
from app.api.routes.v1 import api_v1_router
from app.api.routes.access import get_api_key

api_router = APIRouter(dependencies=[Depends(get_api_key)])
api_router.include_router(health.router, prefix="/health", tags=["Health"])
api_router.include_router(api_v1_router)