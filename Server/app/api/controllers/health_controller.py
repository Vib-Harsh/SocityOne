def check_health() -> dict:
	"""Controller to handle health check requests."""
	return {"status": "ok", "message": "Server is healthy and running"}
