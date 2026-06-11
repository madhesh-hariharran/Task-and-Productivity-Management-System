export type Priority = 'low' | 'medium' | 'high'
export type Status = 'todo' | 'in_progress' | 'completed'

export type Task = {
    id: number
    title: string
    description: string | null
    priority: Priority
    status: Status
    deadline: string | null
    is_completed: boolean
    completed_at: string | null
    created_at: string
    updated_at: string | null
}

export type CreateTaskPayload = {
    title: string
    description?: string
    priority?: Priority | null
    deadline?: string | null
}

export type UpdateTaskPayload = {
    title?: string
    description?: string
    priority?: Priority | null
    deadline?: string | null
    status?: Status | null
    is_completed?: boolean | null
}