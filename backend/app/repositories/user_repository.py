from sqlalchemy.orm import Session
from app.models.user_model import User
from app.enums.user_enum import UserRoleEnum

def get_user_by_email(db: Session, email: str):
    user =  db.query(User).filter(User.email == email).first()
    return user #no need to check if not user since .first() returns None for that

def get_user_by_username(db: Session, username: str):
    user = db.query(User).filter(User.username == username).first()
    return user

def get_user_by_id(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    return user


def create_user(db: Session, username: str, email: str, hashed_password: str,
                role: UserRoleEnum, phone_number: str | None):
    
    company_domain = email.split('@')[1].lower() if role in (UserRoleEnum.MANAGER, UserRoleEnum.WORKER) else None

    new_user = User(
        username = username,
        email = email,
        hashed_password = hashed_password,
        role = role,
        phone_number = phone_number,
        company_domain = company_domain  
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user) #to load automatically generated values in db like created_at, id

    return new_user

def get_workers_by_domain(db: Session, domain: str):
    workers = db.query(User).filter(User.role == UserRoleEnum.WORKER, User.company_domain == domain).all()
    return workers
