from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.controllers.v1 import module_controller
from app.schemas.module import ModuleCreate, ModuleUpdate

router = APIRouter()

@router.get("/", summary="List Modules", description="Retrieve all modules and submodules.")
def list_modules(db: Session = Depends(get_db)):
    return module_controller.list_modules(db)

@router.get("/{module_id}", summary="Get Module Detail", description="Retrieve details of a module by its ID.")
def read_module(module_id: int, db: Session = Depends(get_db)):
    return module_controller.get_module(db, module_id)

@router.post("/", summary="Create Module", description="Create a new module.", status_code=status.HTTP_201_CREATED)
def create_module(module: ModuleCreate, db: Session = Depends(get_db)):
    return module_controller.create_new_module(db, module.model_dump())

@router.put("/{module_id}", summary="Update Module", description="Update an existing module's details.")
def update_module(module_id: int, module: ModuleUpdate, db: Session = Depends(get_db)):
    return module_controller.update_existing_module(db, module_id, module.model_dump(exclude_unset=True))

@router.delete("/{module_id}", summary="Delete Module", description="Delete an existing module.")
def delete_module(module_id: int, db: Session = Depends(get_db)):
    return module_controller.delete_existing_module(db, module_id)
