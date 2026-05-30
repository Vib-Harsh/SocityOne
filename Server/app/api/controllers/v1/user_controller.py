from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.api.services import user_service
from app.utils.logger import logger

def list_users(db: Session):
    """List all users."""
    logger.info("Listing users in controller")
    users = user_service.get_all_users(db)
    return [user.toList() for user in users]

def get_user(db: Session, user_id: int):
    """Retrieve details of a single user."""
    logger.info(f"Retrieving user with ID {user_id} in controller")
    user = user_service.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found"
        )
    return user.toDict()

def create_new_user(db: Session, user_data: dict):
    """Create a new user."""
    logger.info("Creating a new user in controller")
    name = user_data.get("name")
    email = user_data.get("email")
    password = user_data.get("password")
    role_id = user_data.get("role_id")
    
    if not all([name, email, password, role_id]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name, email, password, and role_id are all required"
        )
        
    # Check if email is already taken
    existing_user = user_service.get_user_by_email(db, email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Email '{email}' is already registered"
        )
        
    user = user_service.create_user(db, name=name, email=email, password=password, role_id=role_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create user. Ensure that role_id {role_id} is valid."
        )
    return user.toDict()

def update_existing_user(db: Session, user_id: int, user_data: dict):
    """Update an existing user."""
    logger.info(f"Updating user with ID {user_id} in controller")
    name = user_data.get("name")
    email = user_data.get("email")
    password = user_data.get("password")
    role_id = user_data.get("role_id")
    
    # Check if new email conflicts with another user's email
    if email:
        existing_user = user_service.get_user_by_email(db, email)
        if existing_user and existing_user.id != user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Email '{email}' is already registered by another user"
            )
            
    updated_user = user_service.update_user(
        db, 
        user_id=user_id, 
        name=name, 
        email=email, 
        password=password, 
        role_id=role_id
    )
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found or role_id is invalid"
        )
    return updated_user.toDict()

def delete_existing_user(db: Session, user_id: int):
    """Delete an existing user."""
    logger.info(f"Deleting user with ID {user_id} in controller")
    success = user_service.delete_user(db, user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found"
        )
    return {"message": f"User with ID {user_id} deleted successfully"}
