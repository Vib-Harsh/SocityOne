from pydantic import BaseModel
from typing import Optional
from app.schemas.common import Filter
from app.models.user import UserStatus

class UserBase(BaseModel):
    name: str
    email: str
    role_id: int

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    role_id: Optional[int] = None

class UserFilter(Filter):
    status: Optional[UserStatus] = None
