from app.utils.logger import logger

def get_health_status() -> dict:
	"""Service to get the health status of the application."""
	logger.debug("Checking health status in service layer")
	return {"status": "ok", "message": "Server is healthy and running"}
