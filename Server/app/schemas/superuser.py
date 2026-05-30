from pydantic import BaseModel
from typing import Optional

class SuperRoleLogin(BaseModel):
    email: str
    password: str