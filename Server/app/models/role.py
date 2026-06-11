

from typing import Optional, TypedDict, cast
from sqlalchemy import ForeignKey, Integer
from sqlalchemy import Column, String
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import BaseModel

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

