from __future__ import annotations
from typing import TypedDict, cast, Optional, TYPE_CHECKING
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import BaseModel

if TYPE_CHECKING:
    from app.models.permission import Permission

class BaseModule(TypedDict):
    id: int
    name: str
    code: str
    url: str
    parent_id: Optional[int]
    is_active: bool

class Module(BaseModel):
    __tablename__ = "modules"
    __relation_name__ = "Module"

    name: Mapped[str] = mapped_column(String, nullable=False)
    code: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    url: Mapped[str] = mapped_column(String, nullable=True)
    parent_id: Mapped[Optional[int]] = mapped_column(ForeignKey("modules.id", ondelete="CASCADE"), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    parent: Mapped[Optional[Module]] = relationship("Module", remote_side="Module.id", back_populates="submodules")
    submodules: Mapped[list[Module]] = relationship("Module", back_populates="parent", cascade="all, delete-orphan")
    permissions: Mapped[list[Permission]] = relationship("Permission", back_populates="module", cascade="all, delete-orphan")

    def toDict(self) -> BaseModule:
        return {
            "id": cast(int, self.id),
            "name": cast(str, self.name),
            "code": cast(str, self.code),
            "url": cast(str, self.url) if self.url else "",
            "parent_id": cast(Optional[int], self.parent_id),
            "is_active": cast(bool, self.is_active)
        }
