from __future__ import annotations
from typing import TypedDict, cast, TYPE_CHECKING
from sqlalchemy import ForeignKey, Boolean, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import BaseModel

if TYPE_CHECKING:
    from app.models.role import Role
    from app.models.module import Module

PERMISSION_READ = "read"
PERMISSION_WRITE = "write"
PERMISSION_EDIT = "edit"
PERMISSION_DELETE = "delete"


class BasePermission(TypedDict):
    id: int
    role_id: int
    module_id: int
    read: bool
    write: bool
    edit: bool
    delete: bool

class Permission(BaseModel):
    __tablename__ = "permissions"
    __relation_name__ : str = "Permission"
    __table_args__ = (UniqueConstraint('role_id', 'module_id', name='uq_role_module'),)

    role_id: Mapped[int] = mapped_column(ForeignKey("roles.id", ondelete="CASCADE"), nullable=False)
    module_id: Mapped[int] = mapped_column(ForeignKey("modules.id", ondelete="CASCADE"), nullable=False)
    read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    write: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    edit: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    delete: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    role: Mapped[Role] = relationship("Role", back_populates="permissions")
    module: Mapped[Module] = relationship("Module", back_populates="permissions")

    def toDict(self) -> BasePermission:
        return {
            "id": cast(int, self.id),
            "role_id": cast(int, self.role_id),
            "module_id": cast(int, self.module_id),
            "read": cast(bool, self.read),
            "write": cast(bool, self.write),
            "edit": cast(bool, self.edit),
            "delete": cast(bool, self.delete)
        }

    def to_permission_dict(self) -> dict:
        access = []
        if self.read: access.append(PERMISSION_READ)
        if self.write: access.append(PERMISSION_WRITE)
        if self.edit: access.append(PERMISSION_EDIT)
        if self.delete: access.append(PERMISSION_DELETE)
        
        return {
            "module_id": self.module_id,
            "module_name": self.module.name if self.module else "",
            "module_url": self.module.url if self.module else "",
            "module_code": self.module.code if self.module else "",
            "module_parent_id": self.module.parent_id if self.module else "",
            "access": access
        }
