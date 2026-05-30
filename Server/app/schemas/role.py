from pydantic import BaseModel
from typing import Optional

class RoleBase(BaseModel):
    name: str
    power_level: int = 0

class RoleCreate(RoleBase):
    pass

class RoleUpdate(BaseModel):
    name: Optional[str] = None
    power_level: Optional[int] = None
