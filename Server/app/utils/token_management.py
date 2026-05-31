import jwt
from datetime import datetime, timedelta, timezone
from app.core.config import settings
from app.utils.logger import logger
from typing import Optional

def generateToken(data: dict) -> str:
    """
    Generate a JWT token with the provided data payload.
    The token will expire in exactly 1 day.
    """
    payload = data.copy()
    # Set expiration to 1 day from now
    expire = datetime.now(timezone.utc) + timedelta(days=1)
    payload.update({"exp": expire})
    
    # Sign using PyJWT with HS256 algorithm and FERNET_KEY secret
    token = jwt.encode(payload, settings.TOKEN_SECRET_KEY, algorithm="HS256")
    return token

def decodeToken(token: str) -> Optional[dict]:
    """
    Decode and validate a JWT token.
    Returns the decoded payload dictionary if valid and not expired,
    otherwise returns None if the token is invalid or expired.
    """
    try:
        # Decode and verify signature & expiration
        payload = jwt.decode(token, settings.TOKEN_SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        logger.warning("JWT token signature has expired")
        return None
    except jwt.InvalidTokenError as e:
        logger.warning(f"JWT token decoding failed: {e}")
        return None