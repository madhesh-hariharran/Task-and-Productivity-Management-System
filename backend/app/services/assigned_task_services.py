from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.schemas.assigned_task_schema import CreateAssignedTask, UpdateAssignedTask, AssignedTaskResponse
from app.repositories.assigned_task_repository import (
    create_assigned_task,
    get_tasks_assigned_by,
    get_tasks_assigned_to,
    get_assigned_task_by_id,
    update_assigned_task,
    delete_assigned_task
) 
from app.repositories.user_repository import get_user_by_id, get_company_members_by_domain
from app.models.user_model import User
from app.enums.user_enum import UserRoleEnum


def _to_response(task, db: Session) -> AssignedTaskResponse:
    """
    Task model doesn't store usernames — only IDs.
    This helper fetches assigner and assignee usernames from the DB
    and builds the full response object.
    Called whenever we need to return an AssignedTaskResponse.
    """
    assigner = get_user_by_id(db, task.assigner_id)
    assignee = get_user_by_id(db, task.assignee_id)
    return AssignedTaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        priority=task.priority,
        status=task.status,
        deadline=task.deadline,
        is_completed=task.is_completed,
        completed_at=task.completed_at,
        created_at=task.created_at,
        updated_at=task.updated_at,
        assigner_id=task.assigner_id,
        assigner_username=assigner.username if assigner else "unknown",
        assignee_id=task.assignee_id,
        assignee_username=assignee.username if assignee else "unknown",
    )

def assign_task_service(db: Session, current_user: User, assigned_task_data: CreateAssignedTask) -> AssignedTaskResponse:
    # Only managers can assign tasks
    if current_user.role != UserRoleEnum.MANAGER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only managers can assign tasks"
        )
    
    # Verify the assignee exists
    assignee = get_user_by_id(db, assigned_task_data.assignee_id)
    if not assignee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignee not found"
        )
    
    # Assignee must be a company account (manager or worker) - personal users cant receive tasks
    if assignee.role == UserRoleEnum.PERSONAL:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tasks can only be assigned to company accounts (managers or workers)"
        )
    
    # Assignee must be in the same company domain as the manager
    if assignee.company_domain != current_user.company_domain:
        raise HTTPException(\
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You can only assign tasks to people in your organisation"    
        )
    
    task = create_assigned_task(db, current_user.id, assigned_task_data)
    return _to_response(task, db)

def get_assigned_by_me_service(db: Session, current_user: User) -> dict[str, list[AssignedTaskResponse]]:
    """
    For managers — returns tasks grouped by assignee username.
    Shape: { "alice": [task1, task2], "bob": [task3] }
    Frontend renders each key as a collapsible section.
    """
    tasks = get_tasks_assigned_by(db, current_user.id)
    grouped: dict[str, list[AssignedTaskResponse]] = {}

    for task in tasks:
        response = _to_response(task, db)
        username = response.assignee_username
        if username not in grouped:
            grouped[username] = []
            grouped[username].append(response)
        
    return grouped

def get_assigned_to_me_service(db: Session, current_user: User) -> list[AssignedTaskResponse]:
    # for workers - flat list of tasks assigned to them
    tasks = get_tasks_assigned_to(db, current_user.id)
    return [_to_response(task, db) for task in tasks]

def update_assigned_task_service(
        db: Session, current_user: User, task_id: int, update_data: UpdateAssignedTask
) -> AssignedTaskResponse:
    task = get_assigned_task_by_id(db, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Both manager(assigner) and worker(assignee) can update
    if current_user.id not in (task.assigner_id, task.assignee_id):
        raise HTTPException(
            status=status.HTTP_403_FORBIDDEN,
            detail="Forbidden access"
        )
    
    task = update_assigned_task(db, task, update_data)
    return _to_response(task, db)

def delete_assigned_task_service(db: Session, current_user: User, task_id: int) -> AssignedTaskResponse:
    task = get_assigned_task_by_id(db, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    # Only the manager who assigned the task can delete it
    if current_user.id != task.assigner_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the assigning manager can delete this task"
        )
    
    response = _to_response(task, db)
    delete_assigned_task(db, task)
    return response

def get_assignable_users_service(db: Session, current_user: User) -> list[dict]:
    """
    Returns all company members (managers + workers) in the same domain as the current manager.
    Used to populate the assignee dropdown — anyone in the same org can receive a task.
    Personal users are excluded since they have no company domain.
    """

    if current_user.role != UserRoleEnum.MANAGER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only managers can fetch assignaable users"
        )
    if not current_user.company_domain:
        return []
    
    users = get_company_members_by_domain(db, current_user.company_domain)
    #Exclude manager themselves from the dropdown
    return [
        {"id": u.id, "username": u.username, "role": u.role}
        for u in users
        if u.id != current_user.id
    ]