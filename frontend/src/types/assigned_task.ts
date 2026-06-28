import type { Priority, Status } from "./task"

export type GroupBy = "person" | "priority" | "status"

export type AssignedTask = {
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
    assigner_id: number
    assigner_username: string
    assignee_id: number
    assignee_username: string
}

export type CreateAssignedTaskPayload = {
    title: string
    description?: string
    priority?: Priority
    deadline?: string | null
    assignee_id: number
}

export type UpdateAssignedTaskPayload = {
    title?: string
    description?: string | null
    priority?: string
    deadline?: string | null
    status?: string
    is_completed?: boolean
}

// Shape returned by GET /assigned-tasks/created
// Keys are assignee usernames, values are their task lists
export type GroupedAssignedTasks = Record<string, AssignedTask[]>       //type MethodB = { [key: string]: AssignedTask[] } - Standard index signature

// Shape returned by GET /assigned-tasks/workers
export type AssignableUser = {
    id: number
    username: string
    role: string
}