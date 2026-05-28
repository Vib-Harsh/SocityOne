from fastapi import APIRouter
from app.api.controllers import health_controller

router = APIRouter()

@router.get("/", summary="Health Check", description="Returns the health status of the API.")
def health_check():
	"""Route definition for health check."""
	return health_controller.check_health()
