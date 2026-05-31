from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.api.services import role_service
from app.utils.logger import logger

def list_roles(db: Session):
    """Retrieve all roles."""
    logger.info("Listing roles in controller")
    roles = role_service.get_all_roles(db)
    return [role.toList() for role in roles]

def get_role(db: Session, role_id: int):
    """Retrieve details of a single role."""
    logger.info(f"Retrieving role with ID {role_id} in controller")
    role = role_service.get_role_by_id(db, role_id)
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Role with ID {role_id} not found"
        )
    return role.toDict()

def create_new_role(db: Session, role_data: dict):
    """Create a new role."""
    logger.info(f"Creating a new role in controller: {role_data}")
    name = role_data.get("name")
    power_level = role_data.get("power_level", 0)
    
    if not name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role name is required"
        )
        
    role = role_service.create_role(db, name=name, power_level=power_level)
    return role.toDict()

def update_existing_role(db: Session, role_id: int, role_data: dict):
    """Update details of a role."""
    logger.info(f"Updating role with ID {role_id} in controller")
    name = role_data.get("name")
    power_level = role_data.get("power_level")
    
    updated_role = role_service.update_role(db, role_id=role_id, name=name, power_level=power_level)
    if not updated_role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Role with ID {role_id} not found"
        )
    return updated_role.toDict()

def delete_existing_role(db: Session, role_id: int):
    """Delete a role."""
    logger.info(f"Deleting role with ID {role_id} in controller")
    success = role_service.delete_role(db, role_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Role with ID {role_id} not found"
        )
    return {"message": f"Role with ID {role_id} deleted successfully"}
