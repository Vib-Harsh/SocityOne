from __future__ import annotations
from typing import TypedDict, cast, TYPE_CHECKING
from sqlalchemy import  Integer
from sqlalchemy import  String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import BaseModel

if TYPE_CHECKING:
    from app.models.permission import Permission

class BaseRole(TypedDict):
    id: int
    name: str
    power_level: int

class RoleDict(BaseRole):
    created_at: str
    updated_at: str

class Role(BaseModel):
    __tablename__ = "roles"
    __relation_name__ = "Role"

    name: Mapped[str] = mapped_column(String, nullable=False)
    power_level: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    permissions: Mapped[list[Permission]] = relationship("Permission", back_populates="role", cascade="all, delete-orphan")

    def toList(self) -> BaseRole:
        return {
            "id": cast(int, self.id),
            "name": cast(str, self.name),
            "power_level": cast(int, self.power_level)
        }
    
    def toDict(self) -> RoleDict:
        return {
            "id": cast(int, self.id),
            "name": cast(str, self.name),
            "power_level": cast(int, self.power_level),
            "created_at": cast(str, self.created_at),
            "updated_at": cast(str, self.updated_at)
        }

    def get_permissions_list(self) -> list[dict]:
        return [p.to_permission_dict() for p in self.permissions]
