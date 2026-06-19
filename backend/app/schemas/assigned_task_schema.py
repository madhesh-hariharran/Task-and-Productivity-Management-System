from pydantic import BaseModel, ConfigDict
from app.enums.task_enum import PriorityEnum, StatusEnum
from datetime import datetime
from typing import Optional

class CreateAssignedTask(BaseModel):
    title: str
    description: Optional[str] = None
    priority: Optional[PriorityEnum] = PriorityEnum.MEDIUM
    deadline: Optional[datetime] = None
    assignee_id: int        #worker's user id - reqd

class UpdateAssignedTask(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[PriorityEnum] = None
    deadline: Optional[datetime] = None
    status: Optional[StatusEnum] = None
    is_completed: Optional[bool] = None

class AssignedTaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    priority: PriorityEnum
    status: StatusEnum
    deadline: Optional[datetime] = None
    is_completed: bool
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    # who assigned and who it is assigned to will be populated by service layer join
    assigner_id: int
    assigner_username: str
    assignee_id: int
    assignee_username: str
    model_config = ConfigDict(from_attributes=True)
