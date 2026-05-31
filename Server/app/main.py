from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from app.api.routes import api_router
from app.utils.logger import logger
from app.core.config import settings
from app.core.database import init_db
import traceback


app = FastAPI(title="SocietyOne API", version="1.0.0")

init_db()
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler that logs the error with its full traceback.
    """
    error_msg = f"Unhandled exception at {request.method} {request.url}\n{traceback.format_exc()}"
    logger.error(error_msg)
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "message": "An internal server error occurred.", 
            "details": str(exc) if settings.IS_DEV else "Internal Server Error"
        },
    )

app.include_router(api_router)

@app.on_event("startup")
async def startup_event():
    logger.info(f"Starting up SocietyOne API in {settings.ENVIRONMENT} mode.")
