from sqlalchemy.orm import Session
from app.schemas.task_schema import TaskCreate, TaskUpdate
from app.schemas.report_schema import PriorityBreakdown, StatusBreakdown, ProductivityReport
from app.repositories.task_repository import create_task, get_task_by_id, get_tasks_by_user, update_task, delete_task, filter_tasks, sort_tasks, total_count, count_by_priority, count_by_status, count_due_this_week, count_due_today, count_overdue, get_completed_tasks
from app.enums.task_enum import PriorityEnum, StatusEnum
from datetime import datetime
from fastapi import HTTPException, status

not_found_exception = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="task not found"
)

forbidden_exception = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="Forbidden access"
)

def create_task_service(db: Session, user_id: int, task_data: TaskCreate):
    new_task = create_task(db, user_id, task_data)
    return new_task

def get_tasks_service(db: Session, user_id: int):
    tasks = get_tasks_by_user(db, user_id)
    return tasks

def update_task_service(db: Session, user_id: int, task_id: int, task_data: TaskUpdate):
    task_to_be_updated = get_task_by_id(db, task_id)
    if not task_to_be_updated:
        raise not_found_exception
    if user_id != task_to_be_updated.user_id:
        raise forbidden_exception
    updated_task = update_task(db, task_to_be_updated, task_data)
    return updated_task

def delete_task_service(db: Session, user_id: int, task_id:int):
    task_to_be_deleted = get_task_by_id(db, task_id)
    if not task_to_be_deleted:
        raise not_found_exception
    if user_id != task_to_be_deleted.user_id:
        raise forbidden_exception
    delete_task(db, task_to_be_deleted)
    return task_to_be_deleted

def filter_and_sort_tasks_service(db:Session, user_id: int, priority: PriorityEnum | None, status: StatusEnum | None, deadline_before: datetime | None, deadline_after: datetime | None, sort_by: str | None, order: str | None):
    filtered_tasks = filter_tasks(db, user_id, priority, status, deadline_before, deadline_after)
    sorted_tasks = sort_tasks(filtered_tasks, sort_by, order)
    filtered_sorted_tasks = sorted_tasks.all()
    return filtered_sorted_tasks

def get_productivity_report_service(db: Session, user_id: int):
    total_tasks = total_count(db, user_id)
    total_completed = count_by_status(db, user_id, StatusEnum.COMPLETED)
    total_pending = total_tasks - total_completed

    total_overdue = count_overdue(db, user_id)
    total_due_today = count_due_today(db, user_id)
    total_due_this_week = count_due_this_week(db, user_id)

    if total_tasks > 0:
        completion_rate = (total_completed / total_tasks) * 100
    else:
        completion_rate = 0
    
    completion_rate = round(completion_rate, 2)

    priority_breakdown = PriorityBreakdown(
        low = count_by_priority(db, user_id, PriorityEnum.LOW),
        medium = count_by_priority(db, user_id, PriorityEnum.MEDIUM),
        high = count_by_priority(db, user_id, PriorityEnum.HIGH)
    )

    status_breakdown = StatusBreakdown(
        todo = count_by_status(db, user_id, StatusEnum.TODO),
        in_progress = count_by_status(db, user_id, StatusEnum.IN_PROGRESS),
        completed = count_by_status(db, user_id, StatusEnum.COMPLETED)
    )

    completed_tasks = get_completed_tasks(db, user_id)
    valid_durations = [
        (task.completed_at - task.created_at).total_seconds() / 3600
        for task in completed_tasks
        if task.completed_at and task.created_at
    ]
    if valid_durations:
        avg_completion_hours = round(sum(valid_durations) / len(valid_durations), 2)
    else:
        avg_completion_hours = None
    
    return ProductivityReport(
        total_tasks = total_tasks,
        completed_tasks = total_completed,
        pending_tasks = total_pending,
        overdue_tasks = total_overdue,
        completion_rate = completion_rate,
        tasks_due_today = total_due_today,
        tasks_due_this_week = total_due_this_week,
        priority_breakdown = priority_breakdown,
        status_breakdown = status_breakdown,
        avg_completion_time_hours = avg_completion_hours
    )
    

