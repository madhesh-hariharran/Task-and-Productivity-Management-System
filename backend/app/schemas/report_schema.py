from pydantic import BaseModel

class PriorityBreakdown(BaseModel):
    low: int
    medium: int
    high: int

class StatusBreakdown(BaseModel):
    todo: int
    in_progress: int
    completed: int

class ProductivityReport(BaseModel):
    total_tasks: int
    completed_tasks: int
    pending_tasks: int
    overdue_tasks: int

    completion_rate: float

    tasks_due_today: int
    tasks_due_this_week: int

    priority_breakdown: PriorityBreakdown
    status_breakdown: StatusBreakdown

    avg_completion_time_hours: float | None = None
