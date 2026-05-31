from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    PORT: int = int(os.getenv("PORT", 8000))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    FERNET_KEY: str = os.getenv("FERNET_KEY", "")
    if not FERNET_KEY:
        raise ValueError("FERNET_KEY is required")
    TOKEN_SECRET_KEY: str = os.getenv("TOKEN_SECRET_KEY", "")
    API_KEY: str = os.getenv("API_KEY", "")
    APPLICATION_KEY: str = os.getenv("APPLICATION_KEY", "")
    

    # Postgres Database ...
    DATABASE_HOST: str = os.getenv("DATABASE_HOST", "localhost")
    DATABASE_PORT: str = os.getenv("DATABASE_PORT", "5432")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "society_one")
    DATABASE_USER: str = os.getenv("DATABASE_USER", "postgres")
    DATABASE_PASSWORD: str = os.getenv("DATABASE_PASSWORD", "")
    if not DATABASE_PASSWORD:
        raise ValueError("DATABASE_PASSWORD is required")

    # Super Admin ...
    SUPER_ADMIN_EMAIL: str = os.getenv("SUPER_ADMIN_EMAIL", "")
    SUPER_ADMIN_PASSWORD: str = os.getenv("SUPER_ADMIN_PASSWORD", "")
    if not SUPER_ADMIN_EMAIL:
        raise ValueError("SUPER_ADMIN_EMAIL is required")
    if not SUPER_ADMIN_PASSWORD:
        raise ValueError("SUPER_ADMIN_PASSWORD is required")
    
    
    IS_DEV: bool = ENVIRONMENT.lower() == "development"
    DATABASE_URL: str = f"postgresql://{DATABASE_USER}:{DATABASE_PASSWORD}@{DATABASE_HOST}:{DATABASE_PORT}/{DATABASE_NAME}"

    CORS_ORIGINS: list[str] = []
    cors_origins_env = os.getenv("CORS_ORIGINS", "")
    if cors_origins_env:
        CORS_ORIGINS = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]
    else:
        CORS_ORIGINS = [
            "http://localhost:8082",
            "http://127.0.0.1:8082",
            "http://localhost:8081",
        ]

settings = Settings()
