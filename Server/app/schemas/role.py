from pydantic import BaseModel
from typing import Optional, List
from app.schemas.common import Filter

class RoleBase(BaseModel):
    name: str
    power_level: int = 0

class RoleCreate(RoleBase):
    pass

class RoleUpdate(BaseModel):
    name: Optional[str] = None
    power_level: Optional[int] = None

class RoleFilter(Filter):
    status: Optional[str] = None

class PermissionSchema(BaseModel):
    module_id: int
    access: List[str]

class RolePermissionsUpsert(BaseModel):
    permissions: List[PermissionSchema]