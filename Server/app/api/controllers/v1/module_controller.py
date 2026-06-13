from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.api.services import module_service
from app.utils.logger import logger

def list_modules(db: Session):
    logger.info("Listing modules in controller")
    modules = module_service.list_modules(db)
    return [module.toDict() for module in modules]

def get_module(db: Session, module_id: int):
    logger.info(f"Retrieving module with ID {module_id} in controller")
    module = module_service.get_module_by_id(db, module_id)
    if not module:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Module with ID {module_id} not found"
        )
    return module.toDict()

def create_new_module(db: Session, module_data: dict):
    logger.info(f"Creating a new module in controller: {module_data}")
    name = module_data.get("name")
    code = module_data.get("code")
    url = module_data.get("url")
    parent_id = module_data.get("parent_id")
    is_active = module_data.get("is_active", True)
    
    if not name or not code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Module name and code are required"
        )
        
    existing_module = module_service.get_module_by_code(db, code)
    if existing_module:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Module with code '{code}' already exists"
        )
        
    if url:
        existing_url = module_service.get_module_by_url(db, str(url))
        if existing_url:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"'{url}' Url is already exists"
            )

    if parent_id:
        parent_module = module_service.get_module_by_id(db, parent_id)
        if not parent_module:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Parent module with ID '{parent_id}' does not exist"
            )
            
    module = module_service.create_module(
        db, name=name, code=code, url=url, parent_id=parent_id, is_active=is_active
    )
    return module.toDict()

def update_existing_module(db: Session, module_id: int, module_data: dict):
    logger.info(f"Updating module with ID {module_id} in controller")
    
    code = module_data.get("code")
    if code:
        existing_module = module_service.get_module_by_code(db, code)
        if existing_module and existing_module.id != module_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Module with code '{code}' already exists"
            )
            
    url = module_data.get("url")
    if url:
        existing_url = module_service.get_module_by_url(db, str(url))
        if existing_url and existing_url.id != module_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"'{url}' Url is already exists"
            )
            
    parent_id = module_data.get("parent_id")
    if parent_id is not None:
        if parent_id == module_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A module cannot be its own parent"
            )
        parent_module = module_service.get_module_by_id(db, parent_id)
        if not parent_module:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Parent module with ID '{parent_id}' does not exist"
            )
            
    updated_module = module_service.update_module(
        db, 
        module_id=module_id, 
        name=module_data.get("name"), 
        code=code, 
        url=module_data.get("url"),
        parent_id=parent_id,
        is_active=module_data.get("is_active")
    )

    if not updated_module:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Module with ID {module_id} not found"
        )
    return updated_module.toDict()

def delete_existing_module(db: Session, module_id: int):
    logger.info(f"Deleting module with ID {module_id} in controller")
    success = module_service.delete_module(db, module_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Module with ID {module_id} not found"
        )
    return {"message": f"Module with ID {module_id} deleted successfully"}
