from app.api.services import health_service
from app.utils.logger import logger

def check_health() -> dict:
	"""Controller to handle health check requests."""
	logger.info("Health check controller called")
	return {"status": "ok", "message": "Server is healthy and running"}
