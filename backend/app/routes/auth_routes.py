from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user_schema import UserCreate, UserResponse, TokenResponse
from app.services.auth_service import register_user_service, login_user_service, get_current_user_service
from app.models.user_model import User
from app.utils.dependencies import get_current_user

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

@router.post("/register", response_model= UserResponse)
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    return register_user_service(db, user_data)

@router.post("/login", response_model=TokenResponse)
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    return login_user_service(db, form_data)

@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return get_current_user_service(current_user)