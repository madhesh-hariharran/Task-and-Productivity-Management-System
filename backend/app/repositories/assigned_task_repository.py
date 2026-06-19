from sqlalchemy.orm import Session
from app.models.task_model import Task
from app.schemas.assigned_task_schema import CreateAssignedTask, UpdateAssignedTask
from app.enums.task_enum import StatusEnum
from datetime import datetime

def create_assigned_task(db: Session, assigner_id: int, assigned_task_data: CreateAssignedTask) -> Task:
    task = Task(
        title = assigned_task_data.title,
        description = assigned_task_data.description,
        priority = assigned_task_data.priority,
        deadline = assigned_task_data.deadline,
        is_assigned = True,
        assigner_id =  assigner_id,
        assignee_id = assigned_task_data.assignee_id,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

def get_tasks_assigned_by(db: Session, assigner_id: int) -> list[Task]:
    # Returns all tasks the particular manager created, ordered by assignee so grouping is natural
    return (
        db.query(Task)
        .filter(Task.assigner_id == assigner_id, Task.is_assigned == True)
        .order_by(Task.assignee_id, Task.created_at.desc())
        .all()
    )

def get_tasks_assigned_to(db: Session, assignee_id: int) -> list[Task]:
    return (
        db.query(Task)
        .filter(Task.assignee_id == assignee_id, Task.is_assigned == True)
        .order_by(Task.created_at.desc())
        .all()
    )

def get_assigned_task_by_id(db: Session, task_id: int) -> Task | None:
    return db.query(Task).filter(Task.id == task_id, Task.is_assigned == True).first()

def update_assigned_task(db: Session, task: Task, update_data: UpdateAssignedTask) -> Task:
    if update_data.title is not None:
        task.title = update_data.title
    if update_data.description is not None:
        task.description = update_data.description
    if update_data.priority is not None:
        task.priority = update_data.priority
    if update_data.deadline is not None:
        task.deadline = update_data.deadline

    # status and is_completed are kept in sync - same logic as personal task_repository
    if update_data.status is not None:
        task.status = update_data.status
        if update_data.status == StatusEnum.COMPLETED:
            task.is_completed = True
            task.completed_at = datetime.now()
        else:
            task.is_completed = False
            task.completed_at = None

    if update_data.is_completed is not None:
        task.is_completed = update_data.is_completed
        if update_data.is_completed:
            task.status = StatusEnum.COMPLETED
            task.completed_at = datetime.now()
        else:
            if task.status == StatusEnum.COMPLETED:
                task.status = StatusEnum.TODO
            task.completed_at = None
        
    db.commit()
    db.refresh(task)
    return task
    
def delete_assigned_task(db: Session, task: Task) -> None:
    db.delete(task)
    db.commit()