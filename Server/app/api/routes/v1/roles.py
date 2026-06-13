from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.controllers import role_controller
from app.schemas.role import RoleCreate, RoleUpdate, RolePermissionsUpsert, RoleFilter

router = APIRouter()

@router.get("/", summary="List Roles", description="Retrieve all roles.")
def list_roles(filter: RoleFilter = Depends(), db: Session = Depends(get_db)):
    return role_controller.list_roles(db, filter)

@router.get("/{role_id}", summary="Get Role Detail", description="Retrieve details of a role by its ID.")
def read_role(role_id: int, db: Session = Depends(get_db)):
    return role_controller.get_role(db, role_id)

@router.post("/", summary="Create Role", description="Create a new role.", status_code=status.HTTP_201_CREATED)
def create_role(role: RoleCreate, db: Session = Depends(get_db)):
    return role_controller.create_new_role(db, role.model_dump())

@router.put("/{role_id}", summary="Update Role", description="Update an existing role's details.")
def update_role(role_id: int, role: RoleUpdate, db: Session = Depends(get_db)):
    return role_controller.update_existing_role(db, role_id, role.model_dump(exclude_unset=True))

@router.delete("/{role_id}", summary="Delete Role", description="Delete an existing role.")
def delete_role(role_id: int, db: Session = Depends(get_db)):
    return role_controller.delete_existing_role(db, role_id)

@router.get("/{role_id}/permissions", summary="Get Role Permissions", description="Retrieve the permissions for a specific role.")
def get_permissions(role_id: int, db: Session = Depends(get_db)):
    return role_controller.get_permissions(db, role_id)

@router.put("/{role_id}/permissions", summary="Upsert Role Permissions", description="Update the permissions for a specific role.")
def upsert_role_permissions(role_id: int, permissions_data: RolePermissionsUpsert, db: Session = Depends(get_db)):
    return role_controller.upsert_permissions(db, role_id, permissions_data.model_dump())
