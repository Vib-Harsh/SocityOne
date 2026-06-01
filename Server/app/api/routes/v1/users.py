from app.schemas.common import Filter
from fastapi import Query
from typing import Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.controllers.v1 import user_controller
from app.schemas.user import UserCreate, UserUpdate

router = APIRouter()

@router.get("/", summary="List Users", description="get all user list with pagination search and sort")
def read_users(filter: Filter = Depends(), db: Session = Depends(get_db)):
    return user_controller.list_users(db, filter)

@router.get("/{user_id}", summary="Get User Detail", description="Retrieve details of a user by their ID.")
def read_user(user_id: int, db: Session = Depends(get_db)):
    return user_controller.get_user(db, user_id)

@router.post("/", summary="Create User", description="Create a new user.", status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    return user_controller.create_new_user(db, user.model_dump())

@router.put("/{user_id}", summary="Update User", description="Update an existing user's details.")
def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    return user_controller.update_existing_user(db, user_id, user.model_dump(exclude_unset=True))

@router.delete("/{user_id}", summary="Delete User", description="Delete an existing user.")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    return user_controller.delete_existing_user(db, user_id)
