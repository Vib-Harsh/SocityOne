import enum
from typing import Optional, TypedDict, cast
from app.models.role import Role
from sqlalchemy import ForeignKey, Integer, Column, String, Enum
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.models.base import BaseModel
from app.utils.cryptography import decryptPassword

class BaseUser(TypedDict):
    id: int
    name: str
    email: str

class UserList(BaseUser):
    role: Optional[str]

class UserDict(BaseUser):
    password: str | None
    status: str
    role_id: int
    role_name: str
    created_at: str
    updated_at: str

class UserStatus(enum.Enum):
    ACTIVE = "Active"
    INACTIVE = "Inactive"
    DELETED = "Deleted"

class User(BaseModel):
    __tablename__:str = "users"
    __relation_name__:str = "User"
    
    name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String, nullable=False)
    status: Mapped[UserStatus] = mapped_column(Enum(UserStatus, name='user_status_enum', values_callable=lambda obj: [e.value for e in obj]), default=UserStatus.ACTIVE, nullable=False)
    role_id: Mapped[int] = mapped_column(Integer, ForeignKey(f"{Role.__tablename__}.id"), nullable=False)

    role: Mapped[Role] = relationship(Role.__relation_name__)

    def toList(self)-> UserList:
        return {
            "id": cast(int, self.id),
            "name": cast(str, self.name),
            "email": cast(str, self.email),
            "role": cast(Optional[str], self.role.name if self.role else None)
        }
    
    def toDict(self) -> UserDict:
        return {
            "id": cast(int, self.id),
            "name": cast(str, self.name),
            "email": cast(str, self.email),
            "password": decryptPassword(cast(str, self.password_hash)) if self.password_hash else None,
            "status": cast(str, self.status.value),
            "role_id": cast(int, self.role_id),
            "role_name": cast(str, self.role.name if self.role else ""),
            "created_at": cast(str, self.created_at),
            "updated_at": cast(str, self.updated_at)
        }

