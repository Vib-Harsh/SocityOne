import uvicorn
from app.core.config import settings
from app.utils.logger import logger

if __name__ == "__main__":
    logger.info(f"Initializing uvicorn server on port {settings.PORT}")
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=settings.IS_DEV)
