from app.schemas.role import RoleFilter
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.api.services import role_service
from app.utils.logger import logger
from app.schemas.role import PermissionSchema

def list_roles(db: Session, filter: RoleFilter):
    """Retrieve all roles."""
    logger.info("Listing roles in controller")
    roles = role_service.list_roles(db, filter)
    return {"data": [role.toList() for role in roles], "pagination": filter}

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

    existing_role = role_service.get_role_by_name(db, name)
    if existing_role:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Role '{name}' already exists"
        )
    
    role = role_service.create_role(db, name=name, power_level=power_level)
    return role.toDict()

def update_existing_role(db: Session, role_id: int, role_data: dict):
    """Update details of a role."""
    logger.info(f"Updating role with ID {role_id} in controller")
    name = role_data.get("name")
    power_level = role_data.get("power_level")
    
    # check the new name is present is not
    if name: 
        existing_role = role_service.get_role_by_name(db, name)
        if existing_role and existing_role.id != role_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Role '{name}' already exists"
            )
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

def upsert_permissions(db: Session, role_id: int, permissions_data: dict):
    """Upsert role permissions."""
    logger.info(f"Upserting permissions for role with ID {role_id} in controller")
    permissions_list = permissions_data.get("permissions", [])
    
    parsed_permissions = []
    for p in permissions_list:
        parsed_permissions.append(PermissionSchema(**p))
        
    return role_service.upsert_role_permissions(db, role_id, parsed_permissions)

def get_permissions(db: Session, role_id: int):
    """Get role permissions."""
    logger.info(f"Getting permissions for role with ID {role_id} in controller")

    role = role_service.get_role_by_id(db, role_id)
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Role with ID {role_id} not found"
        )
    permissions = role_service.get_permissions(db, role_id)
    return [permission.to_permission_dict() for permission in permissions]
