from sqlalchemy.orm import Session
from app.models.module import Module
from typing import List, Optional
from app.utils.logger import logger

def list_modules(db: Session) -> List[Module]:
    logger.info("Fetching all modules")
    return db.query(Module).all()

def get_module_by_id(db: Session, module_id: int) -> Optional[Module]:
    logger.info(f"Fetching module with ID {module_id}")
    return db.query(Module).filter(Module.id == module_id).first()

def get_module_by_code(db: Session, code: str) -> Optional[Module]:
    logger.info(f"Fetching module with code {code}")
    return db.query(Module).filter(Module.code == code).first()

def get_module_by_url(db: Session, url: str) -> Optional[Module]:
    logger.info(f"Fetching module with url {url}")
    return db.query(Module).filter(Module.url == url).first()

def create_module(db: Session, name: str, code: str, url: Optional[str] = None, parent_id: Optional[int] = None, is_active: bool = True) -> Module:
    logger.info(f"Creating module with code: {code}")
    db_module = Module(name=name, code=code, url=url, parent_id=parent_id, is_active=is_active)
    db.add(db_module)
    db.commit()
    db.refresh(db_module)
    return db_module

def update_module(db: Session, module_id: int, name: Optional[str] = None, code: Optional[str] = None, url: Optional[str] = None, parent_id: Optional[int] = None, is_active: Optional[bool] = None) -> Optional[Module]:
    logger.info(f"Updating module with ID {module_id}")
    db_module = get_module_by_id(db, module_id)
    if not db_module:
        return None
    
    if name is not None:
        db_module.name = name
    if code is not None:
        db_module.code = code
    if url is not None:
        db_module.url = url
    if parent_id is not None:
        db_module.parent_id = parent_id
    if is_active is not None:
        db_module.is_active = is_active
        
    db.commit()
    db.refresh(db_module)
    return db_module

def delete_module(db: Session, module_id: int) -> bool:
    logger.info(f"Deleting module with ID {module_id}")
    db_module = get_module_by_id(db, module_id)
    if not db_module:
        return False
    
    db.delete(db_module)
    db.commit()
    return True
