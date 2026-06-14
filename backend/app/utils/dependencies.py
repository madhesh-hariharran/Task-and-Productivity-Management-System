from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.database import get_db
from app.utils.jwt_handler import decode_access_token
from app.repositories.user_repository import get_user_by_id
from app.enums.user_enum import UserRoleEnum
from sqlalchemy.orm import Session

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

validation_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Invalid credentials",
    headers={"WWW-Authenticate": "Bearer"}
)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    decoded = decode_access_token(token)
    if decoded is None:
        raise validation_exception
    user = get_user_by_id(db, decoded["user_id"])
    if not user:
        raise validation_exception
    
    return user

def require_manager(current_user = Depends(get_current_user)):
    if current_user.role != UserRoleEnum.MANAGER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only managers can preform this action"
        )
    return current_user

def require_worker_or_manager(current_user = Depends(get_current_user)):
    if current_user.role not in (UserRoleEnum.WORKER, UserRoleEnum.MANAGER):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="this requires a company account"
        )
    return current_user
