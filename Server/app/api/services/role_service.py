from app.schemas.role import RoleFilter, PermissionSchema
from app.models.permission import PERMISSION_DELETE
from app.models.permission import PERMISSION_EDIT
from app.models.permission import PERMISSION_WRITE
from app.models.permission import PERMISSION_READ
from sqlalchemy.orm import Session
from app.models.role import Role
from app.utils.logger import logger
from typing import List, Optional
from app.models.permission import Permission

def list_roles(db: Session, filter: RoleFilter) -> List[Role]:
    """Retrieve a list of roles with filters."""
    logger.info("Fetching roles with filters from database")
    roles_query = db.query(Role)
    if filter.search:
        roles_query = roles_query.filter(Role.name.ilike(f"%{filter.search}%"))
    if filter.sort_by and hasattr(Role, filter.sort_by):
        column_attr = getattr(Role, filter.sort_by)
        sort_key = column_attr.desc() if filter.sort_order == "DESC" else column_attr.asc()
        roles_query = roles_query.order_by(sort_key)
    if filter.page_size is not None and filter.page_index is not None:
        roles_query = roles_query.offset(filter.page_index * filter.page_size).limit(filter.page_size)
    return roles_query.all()

def get_role_by_id(db: Session, role_id: int) -> Optional[Role]:
    """Retrieve a single role by its ID."""
    logger.info(f"Fetching role with ID {role_id} from database")
    return db.query(Role).filter(Role.id == role_id).first()

def get_role_by_name(db: Session, name:str) -> Optional[Role]:
    """Retrieve a single role by its name."""
    logger.info(f"Fetching role with name {name} from database")
    return db.query(Role).filter(Role.name == name).first()

def create_role(db: Session, name: str, power_level: int) -> Role:
    """Create a new role in the database."""
    logger.info(f"Creating role in database with name: {name}, power_level: {power_level}")
    db_role = Role(name=name, power_level=power_level)
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

def update_role(db: Session, role_id: int, name: Optional[str] = None, power_level: Optional[int] = None) -> Optional[Role]:
    """Update an existing role in the database."""
    logger.info(f"Updating role with ID {role_id} in database")
    db_role = get_role_by_id(db, role_id)
    if not db_role:
        return None
    
    if name is not None:
        db_role.name = name
    if power_level is not None:
        db_role.power_level = power_level
            
    db.commit()
    db.refresh(db_role)
    return db_role

def upsert_role_permissions(db: Session, role_id: int, permissions: List[PermissionSchema]) -> list[dict]:
    """Upsert role permissions."""
    logger.info(f"Upserting permissions for role {role_id}")
    db_role = get_role_by_id(db, role_id)
    if not db_role:
        return []

    # delete existing
    db.query(Permission).filter(Permission.role_id == role_id).delete()
    
    # insert new
    for p in permissions:
        read_val = PERMISSION_READ in p.access
        write_val = PERMISSION_WRITE in p.access
        edit_val = PERMISSION_EDIT in p.access
        delete_val = PERMISSION_DELETE in p.access
        
        db_perm = Permission(
            role_id=role_id,
            module_id=p.module_id,
            read=read_val,
            write=write_val,
            edit=edit_val,
            delete=delete_val
        )
        db.add(db_perm)
        
    db.commit()
    db.refresh(db_role)
    return db_role.get_permissions_list()

def get_permissions(db: Session, role_id: int) -> list[Permission]:
    """Get role permissions."""
    logger.info(f"Getting permissions for role with ID {role_id} from database")
    permissions = db.query(Permission).filter(Permission.role_id == role_id).all()
    return permissions

def delete_role(db: Session, role_id: int) -> bool:
    """Delete a role from the database."""
    logger.info(f"Deleting role with ID {role_id} from database")
    db_role = get_role_by_id(db, role_id)
    if not db_role:
        return False
    
    db.delete(db_role)
    db.commit()
    return True
