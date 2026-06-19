from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.utils.dependencies import get_current_user, require_worker_or_manager
from app.schemas.assigned_task_schema import CreateAssignedTask, UpdateAssignedTask, AssignedTaskResponse
from app.services.assigned_task_services import (
    assign_task_service,
    get_assigned_by_me_service,
    get_assigned_to_me_service,
    update_assigned_task_service,
    delete_assigned_task_service,
    get_assignable_users_service,
)
from app.models.user_model import User

router = APIRouter(
    prefix="/assigned-tasks",
    tags=["Assigned Tasks"]
)

@router.post("/", response_model=AssignedTaskResponse)
def assign_task(
    data: CreateAssignedTask,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return assign_task_service(db, current_user, data)

@router.get("/mine", response_model= list[AssignedTaskResponse])
def get_tasks_assigned_to_me(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_worker_or_manager) #calls get current user by depends
):
    return get_assigned_to_me_service(db, current_user)

@router.get("/created", response_model=dict[str, list[AssignedTaskResponse]])
def get_tasks_assigned_by_me(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_worker_or_manager)
):
    # Returns tasks grouped by assignee username: { "arthur": [...], "john": [...] }
    return get_assigned_by_me_service(db, current_user)

@router.get("/workers", response_model=list[dict])
def get_assignable_workers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Returns [{ id, username, role }] for all company members the manager can assign to
    return get_assignable_users_service(db, current_user)

@router.patch("/{task_id}", response_model=AssignedTaskResponse)
def update_assigned_task(
    task_id: int,
    update_data: UpdateAssignedTask,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_worker_or_manager)
):
    return update_assigned_task_service(db, current_user, task_id, update_data)

@router.delete("/{task_id}", response_model=AssignedTaskResponse)
def delete_assigned_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return delete_assigned_task_service(db, current_user, task_id)