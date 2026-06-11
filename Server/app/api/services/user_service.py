from sqlalchemy.orm import Session
from app.models.user import User, UserStatus
from app.models.role import Role
from app.utils.cryptography import encryptPassword
from app.utils.logger import logger
from typing import List, Optional, TypedDict
from app.schemas.user import UserFilter

def list_users(db: Session, filter: UserFilter) -> List[User]:
    """Retrieve a list of users with filters."""
    logger.info("Fetching users with filters from database")
    users_query = db.query(User)
    if filter.search:
        users_query = users_query.filter(User.name.ilike(f"%{filter.search}%") | User.email.ilike(f"%{filter.search}%"))
    if filter.status: 
        users_query = users_query.filter(User.status == filter.status)
    else: 
        users_query = users_query.filter(User.status != UserStatus.DELETED)
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
        db_user.name = name 
    if email is not None:
        db_user.email = email
    if password is not None:
        db_user.password_hash = encryptPassword(password)
    if role_id is not None:
        role_exists = db.query(Role).filter(Role.id == role_id).first()
        if not role_exists:
            logger.error(f"Cannot update user: Role with ID {role_id} does not exist.")
            return None
        db_user.role_id = role_id
        
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int) -> bool:
    """Delete a user."""
    db_user = get_user_by_id(db, user_id)
    if not db_user:
        logger.error(f"Cannot delete user: User with ID {user_id} does not exist.")
        return False
    
    db_user.status = UserStatus.DELETED  
    db.commit()
    db.refresh(db_user)
    return True
