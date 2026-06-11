from fastapi import APIRouter, Security, HTTPException, status, Request, Response
from fastapi.security import HTTPBearer
from fastapi.security.api_key import APIKeyHeader
from app.core.config import settings
from app.utils.logger import logger
import jwt

api_key_header = APIKeyHeader(name="api_key", scheme_name="APIKeyHeader", auto_error=False)
application_key_header = APIKeyHeader(name="application_key", scheme_name="ApplicationKeyHeader", auto_error=False)
token_header = HTTPBearer(scheme_name="JWTToken", auto_error=False)

async def get_api_key(
    request: Request,
    response: Response,
    api_key: str|None = Security(api_key_header),
    application_key: str|None = Security(application_key_header),
    token_credentials: str|None = Security(token_header)
):
    # 1. Fallback header names check (case-insensitive & hyphenated support)
    if not api_key:
        api_key = request.headers.get("x-api-key")
    if not application_key:
        application_key = request.headers.get("x-application-key")

    # 2. Check presence of keys
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized Access"
        )
    if not application_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized Application"
        )

    # 3. Validate values of keys
    if api_key != settings.API_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access Denied"
        )
    if application_key != settings.APPLICATION_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Application Access Denied"  
        )

    # 4. If path starts with api/, validate token as well
    path = request.url.path
    clean_path = path.strip("/")
    if clean_path.startswith("api/"):
        authorization = request.headers.get("authorization")
        token = None
        if authorization:
            if authorization.startswith("Bearer "):
                token = authorization[7:]
            else:
                token = authorization
        
        if not token:
            token = request.cookies.get("token") or request.query_params.get("token")

        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token is missing"
            )

        try:
            # Try decoding token normally
            payload = jwt.decode(token, settings.TOKEN_SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            logger.warning("Token has expired, attempting automatic recreation...")
            try:
                # Decode expired token ignoring expiration
                payload = jwt.decode(
                    token, 
                    settings.TOKEN_SECRET_KEY, 
                    algorithms=["HS256"], 
                    options={"verify_exp": False}
                )
                # Recreate token with same payload
                from app.utils.token_management import generateToken
                new_payload = {k: v for k, v in payload.items() if k not in ("exp", "iat")}
                new_token = generateToken(new_payload)
                
                # Attach to response headers
                response.headers["new-token"] = new_token
                response.headers["X-New-Token"] = new_token
                response.headers["Access-Control-Expose-Headers"] = "new-token, X-New-Token"
                logger.info("Successfully recreated token and attached to response headers.")
            except Exception as e:
                logger.error(f"Failed to recreate token: {e}")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid or malformed expired token"
                )
        except jwt.InvalidTokenError as e:
            logger.warning(f"Invalid token: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid token: {str(e)}"
            )

    return api_key
