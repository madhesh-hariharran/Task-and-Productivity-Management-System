from sqlalchemy import Integer, String, Column, DateTime
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
from app.enums.user_enum import UserRoleEnum

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRoleEnum), nullable=False, default=UserRoleEnum.PERSONAL)
    phone_number = Column(String(20), nullable=True)
    company_domain = Column(String(255), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    tasks_relation = relationship("Task", back_populates="user_relation") 