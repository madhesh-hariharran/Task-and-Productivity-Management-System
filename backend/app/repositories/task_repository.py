from sqlalchemy.orm import Session, Query
from sqlalchemy import func
from app.schemas.task_schema import TaskCreate, TaskUpdate
from app.enums.task_enum import PriorityEnum, StatusEnum
from app.models.task_model import Task
from datetime import datetime, timedelta, date, time

def create_task(db: Session, user_id: int, task_data: TaskCreate):
    new_task = Task(
        title = task_data.title,
        description = task_data.description,
        priority = task_data.priority,
        deadline = task_data.deadline,
        user_id = user_id
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task

def get_tasks_by_user(db: Session, user_id: int):
    tasks = db.query(Task).filter(Task.user_id == user_id).all()
    return tasks

def get_task_by_id(db: Session, task_id: int):
    task = db.query(Task).filter(Task.id == task_id).first()
    return task

def update_task(db: Session, task: Task, task_data: TaskUpdate):
    if task_data.title is not None:
        task.title = task_data.title
    if task_data.description is not None:
        task.description = task_data.description
    if task_data.priority is not None:
        task.priority = task_data.priority
    if task_data.deadline is not None:
        task.deadline = task_data.deadline


    if task_data.status is not None:
        task.status = task_data.status

        if task_data.status == StatusEnum.COMPLETED:
            task.is_completed = True
            task.completed_at = datetime.now()
        else:
            task.is_completed = False
            task.completed_at = None


    if task_data.is_completed is not None:
        task.is_completed = task_data.is_completed

        if task_data.is_completed:
            task.status = StatusEnum.COMPLETED
            task.completed_at = datetime.now()
        else:
            if task.status == StatusEnum.COMPLETED:
                task.status = StatusEnum.TODO
            task.completed_at = None 


    db.commit()
    db.refresh(task)
    return task

def delete_task(db: Session, task: Task):
    db.delete(task)
    db.commit()
    return None

def filter_tasks(db: Session, user_id: int, priority: PriorityEnum| None, status: StatusEnum| None, deadline_before: datetime| None, deadline_after: datetime| None):
    tasks = db.query(Task).filter(Task.user_id == user_id)
    if priority is not None:
        tasks = tasks.filter(Task.priority == priority)
    if status is not None:
        tasks = tasks.filter(Task.status == status)
    if deadline_before is not None:
        tasks = tasks.filter(Task.deadline <= deadline_before)
    if deadline_after is not None:
        tasks = tasks.filter(Task.deadline > deadline_after)
    
    return tasks

def sort_tasks(tasks: Query, sort_by: str| None, order: str| None):
    sortable_fields={
        "deadline": Task.deadline,
        "priority": Task.priority,
        "created_at": Task.created_at,
        "status": Task.status,
        "title": Task.title
    }
    if not sort_by:
        return tasks

    if sort_by not in sortable_fields:
        return tasks
    
    column = sortable_fields[sort_by]
    if order == "desc":
        tasks = tasks.order_by(column.desc())
    else:
        tasks = tasks.order_by(column)
    return tasks


def total_count(db: Session, user_id: int):
    return db.query(func.count(Task.id))\
        .filter(Task.user_id == user_id)\
        .scalar()

def count_by_status(db: Session, user_id: int, status: StatusEnum):
    return db.query(func.count(Task.id))\
        .filter(Task.user_id == user_id, Task.status == status)\
        .scalar()

def count_by_priority(db: Session, user_id: int, priority: PriorityEnum):
    return db.query(func.count(Task.id))\
        .filter(Task.user_id == user_id, Task.priority == priority)\
        .scalar()

def count_overdue(db: Session, user_id: int):
    return db.query(func.count(Task.id))\
        .filter(
            Task.user_id == user_id,
            Task.deadline < datetime.now(),
            Task.is_completed == False
        )\
        .scalar()

def count_due_today(db: Session, user_id: int):
    today_start = datetime.combine(date.today(), time.min)
    today_end = datetime.combine(date.today(), time.max)

    return db.query(func.count(Task.id))\
        .filter(
            Task.user_id == user_id,
            Task.is_completed == False,
            Task.deadline >= today_start,
            Task.deadline <= today_end
        )\
        .scalar()

def count_due_this_week(db: Session, user_id: int):
    now = datetime.now()
    week_end = now + timedelta(days=7)

    return db.query(func.count(Task.id))\
        .filter(
            Task.user_id == user_id,
            Task.is_completed == False,
            Task.deadline >= now,
            Task.deadline <= week_end
        )\
        .scalar()

def get_completed_tasks(db: Session, user_id: int):
    return db.query(Task)\
        .filter(
            Task.user_id == user_id,
            Task.is_completed == True,
            Task.completed_at != None
        )\
        .all()

