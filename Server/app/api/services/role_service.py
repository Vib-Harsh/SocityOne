from sqlalchemy.orm import Session
from app.models.role import Role
from app.utils.logger import logger
from typing import List, Optional

def get_all_roles(db: Session) -> List[Role]:
    """Retrieve all roles from the database."""
    logger.info("Fetching all roles from database")
    return db.query(Role).all()

def get_role_by_id(db: Session, role_id: int) -> Optional[Role]:
    """Retrieve a single role by its ID."""
    logger.info(f"Fetching role with ID {role_id} from database")
    return db.query(Role).filter(Role.id == role_id).first()

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

def delete_role(db: Session, role_id: int) -> bool:
    """Delete a role from the database."""
    logger.info(f"Deleting role with ID {role_id} from database")
    db_role = get_role_by_id(db, role_id)
    if not db_role:
        return False
    
    db.delete(db_role)
    db.commit()
    return True
