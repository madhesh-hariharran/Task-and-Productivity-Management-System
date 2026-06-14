from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.user_schema import UserCreate
from app.repositories.user_repository import get_user_by_email, create_user, get_user_by_username
from app.utils.security import hash_password, verify_password
from app.utils.jwt_handler import create_access_token
from app.models.user_model import User

already_exists_exception = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="already registered"
)

validation_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Invalid Credentials",
    headers={"WWW-Authenticate": "Bearer"}
)

def register_user_service(db: Session, user_data: UserCreate):
    existing_email = get_user_by_email(db, user_data.email)
    if existing_email:
        raise already_exists_exception
    existing_name = get_user_by_username(db, user_data.username)
    if existing_name:
        raise already_exists_exception
    
    hashed_password = hash_password(user_data.password)
    new_user = create_user(
        db, 
        user_data.username, 
        user_data.email,
        hashed_password,
        role = user_data.role,
        phone_number = user_data.phone_number
        )
    return new_user

def login_user_service(db: Session, user_data: OAuth2PasswordRequestForm):
    user = get_user_by_email(db, user_data.username) #formdata of oauth2 has only username and password so email=username
    if not user:
        raise validation_exception
    hashed_password = user.hashed_password
    is_password_right = verify_password(user_data.password, hashed_password)
    if not is_password_right:
        raise validation_exception
    
    access_token = create_access_token(user.id, user.role.value)

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

def get_current_user_service(user: User):
    return user
