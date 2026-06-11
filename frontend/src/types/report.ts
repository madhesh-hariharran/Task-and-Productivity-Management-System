export type PriorityBreakdown = {
    low: number
    medium: number
    high: number
}

export type StatusBreakdown = {
    todo: number
    in_progress: number
    completed: number
}

export type ProductivityReport = {
    total_tasks: number
    completed_tasks: number
    pending_tasks: number
    overdue_tasks: number
    completion_rate: number
    tasks_due_today: number
    tasks_due_this_week: number
    priority_breakdown: PriorityBreakdown
    status_breakdown: StatusBreakdown
    avg_completion_time_hours: number | null
}