from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime, ForeignKey
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
from app.enums.task_enum import PriorityEnum, StatusEnum

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    priority = Column(SQLEnum(PriorityEnum), nullable=False, default=PriorityEnum.MEDIUM) 
    status = Column(SQLEnum(StatusEnum), nullable=False, default=StatusEnum.TODO)
    deadline = Column(DateTime, nullable=True)
    is_completed = Column(Boolean, nullable=False, default=False)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    # Personal task owner - null for assigned tasks
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)

    # Assigned columns - null for personal tasks
    is_assigned = Column(Boolean, nullable=False, default=False)
    assigner_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    assignee_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)

    # Relationships - explicit foreign_keys needed because now there are 3 FKs to users
    user_relation = relationship("User", foreign_keys=[user_id], back_populates="tasks_relation")
    assigner_relation = relationship("User", foreign_keys=[assigner_id])
    assignee_relation = relationship("User", foreign_keys=[assignee_id])