import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PORT: int = int(os.getenv("PORT", 8000))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    IS_DEV: bool = ENVIRONMENT.lower() == "development"

settings = Settings()
