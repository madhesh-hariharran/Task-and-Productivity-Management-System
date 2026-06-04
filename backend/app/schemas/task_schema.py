from pydantic import BaseModel, ConfigDict
from app.enums.task_enum import PriorityEnum, StatusEnum
from datetime import datetime

class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    priority: PriorityEnum | None = None
    deadline: datetime |None = None

class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    priority: PriorityEnum | None = None
    deadline: datetime | None = None
    status: StatusEnum | None = None
    is_completed: bool | None = None

class TaskResponse(BaseModel):
    id: int
    title: str
    description: str | None = None
    priority: PriorityEnum 
    status: StatusEnum 
    deadline: datetime | None = None
    is_completed: bool 
    completed_at: datetime | None = None
    created_at: datetime
    updated_at: datetime | None = None
    model_config = ConfigDict(from_attributes=True)