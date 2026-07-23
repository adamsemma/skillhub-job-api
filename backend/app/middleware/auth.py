from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
from ..config import settings
from ..core.security import verify_token

security = HTTPBearer()

async def authenticate_request(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """Authenticate request using JWT token"""
    token = credentials.credentials
    
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return payload

async def optional_auth(
    request: Request
) -> Optional[dict]:
    """Optional authentication - doesn't require token"""
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return None
    
    try:
        scheme, token = auth_header.split()
        if scheme.lower() != "bearer":
            return None
        return verify_token(token)
    except:
        return None

def require_role(required_role: str):
    """Role-based access control decorator"""
    async def role_checker(user: dict = Depends(authenticate_request)):
        if user.get("role") != required_role and user.get("role") != "admin":
            raise HTTPException(
                status_code=403,
                detail=f"Role '{required_role}' required"
            )
        return user
    return role_checker