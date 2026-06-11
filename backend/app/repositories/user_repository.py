from sqlalchemy.orm import Session
from app.models.user_model import User

def get_user_by_email(db: Session, email: str):
    user =  db.query(User).filter(User.email == email).first()
    return user #no need to check if not user since .first() returns None for that

def get_user_by_username(db: Session, username: str):
    user = db.query(User).filter(User.username == username).first()
    return user

def create_user(db: Session, username: str, email: str, hashed_password: str):
    new_user = User(
        username = username,
        email = email,
        hashed_password = hashed_password  
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user) #to load automatically generated values in db like created_at, id

    return new_user

def get_user_by_id(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    return user

