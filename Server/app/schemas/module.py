from pydantic import BaseModel, ConfigDict
from typing import Optional

class ModuleBase(BaseModel):
    name: str
    code: str
    url: Optional[str] = None
    parent_id: Optional[int] = None
    is_active: bool = True

class ModuleCreate(ModuleBase):
    pass

class ModuleUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    url: Optional[str] = None
    parent_id: Optional[int] = None
    is_active: Optional[bool] = None

class ModuleResponse(ModuleBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
