from app.schemas.common import Filter
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.role import Role
from app.utils.cryptography import encryptPassword
from app.utils.logger import logger
from typing import List, Optional

def list_users(db: Session, filter: Filter) -> List[User]:
    """Retrieve a list of users with filters."""
    logger.info("Fetching users with filters from database")
    users_query = db.query(User)
    if filter.search:
        users_query = users_query.filter(User.name.ilike(f"%{filter.search}%") | User.email.ilike(f"%{filter.search}%"))
    if filter.sort_by and hasattr(User, filter.sort_by):
        column_attr = getattr(User, filter.sort_by)
        sort_key = column_attr.desc() if filter.sort_order == "DESC" else column_attr.asc()
        users_query = users_query.order_by(sort_key)
    if filter.page_size and filter.page_index:
        users_query = users_query.offset(filter.page_index * filter.page_size)
    return users_query.all()

def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    """Retrieve a single user by ID."""
    logger.info(f"Fetching user with ID {user_id} from database")
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Retrieve a single user by email."""
    logger.info(f"Fetching user with email {email} from database")
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, name: str, email: str, password: str, role_id: int) -> Optional[User]:
    """Create a new user."""
    # Check if role exists
    role_exists = db.query(Role).filter(Role.id == role_id).first()
    if not role_exists:
        logger.error(f"Cannot create user: Role with ID {role_id} does not exist.")
        return None
        
    password_hash = encryptPassword(password)
    db_user = User(
        name=name,
        email=email,
        password_hash=password_hash,
        role_id=role_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, name: Optional[str] = None, email: Optional[str] = None, password: Optional[str] = None, role_id: Optional[int] = None) -> Optional[User]:
    """Update an existing user."""
    db_user = get_user_by_id(db, user_id)
    if not db_user:
        return None
    if name is not None:
        db_user.name = name  # type: ignore
    if email is not None:
        db_user.email = email  # type: ignore
    if password is not None:
        db_user.password_hash = encryptPassword(password)  # type: ignore
    if role_id is not None:
        # Check if role exists
        role_exists = db.query(Role).filter(Role.id == role_id).first()
        if not role_exists:
            logger.error(f"Cannot update user: Role with ID {role_id} does not exist.")
            return None
        db_user.role_id = role_id  # type: ignore
        
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int) -> bool:
    """Delete a user."""
    db_user = get_user_by_id(db, user_id)
    if not db_user:
        return False
        
    db.delete(db_user)
    db.commit()
    return True
