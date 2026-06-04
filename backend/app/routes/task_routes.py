from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.utils.dependencies import get_current_user
from app.schemas.task_schema import TaskCreate, TaskUpdate, TaskResponse
from app.schemas.report_schema import ProductivityReport
from app.services.task_service import create_task_service, get_tasks_service, update_task_service, delete_task_service, filter_and_sort_tasks_service, get_productivity_report_service
from app.models.user_model import User
from app.enums.task_enum import PriorityEnum, StatusEnum

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)

@router.post("/", response_model=TaskResponse)
def create_task(task_data: TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_task_service(db, current_user.id, task_data)

@router.get("/", response_model=list[TaskResponse])
def get_tasks(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_tasks_service(db, current_user.id)

@router.get("/filter", response_model=list[TaskResponse])
def filter_tasks(priority: PriorityEnum | None = None, status: StatusEnum | None = None, deadline_before: datetime | None = None, deadline_after: datetime | None = None, sort_by: str | None = None, order: str | None = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return filter_and_sort_tasks_service(db, current_user.id, priority, status, deadline_before, deadline_after, sort_by, order)

@router.get("/report", response_model=ProductivityReport)
def get_productivity_report(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_productivity_report_service(db, current_user.id)

@router.patch("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_data: TaskUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return update_task_service(db, current_user.id, task_id, task_data)

@router.delete("/{task_id}", response_model=TaskResponse)
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return delete_task_service(db, current_user.id, task_id)


