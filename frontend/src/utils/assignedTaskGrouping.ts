import type { AssignedTask, GroupedAssignedTasks } from "../types/assigned_task"
import type { GroupBy } from "../types/assigned_task"

// Section ordering - determines which group header appears first
const PRIORITY_ORDER: Record<string, number> = { high:0, medium:1, low:2 }
const STATUS_ORDER: Record<string, number> = { todo:0, "in progress":1, completed:2 }

// Task ordering within a section
const STATUS_SORT: Record<string, number> = { todo:0, in_progress:1, completed:2 }
const PRIORITY_SORT: Record<string, number> = { high:0, medium:1, low:2 }

export function sortKeys(keys: string[], groupBy: GroupBy): string[] {
    if (groupBy === "priority") return [...keys].sort((a,b) => (PRIORITY_ORDER[a] ?? 99) - (PRIORITY_ORDER[b] ?? 99))
    if (groupBy === "status") return [...keys].sort((a,b) => (STATUS_ORDER[a] ?? 99) - (STATUS_ORDER[b] ?? 99))
    return [...keys].sort() // person - alphabetical
    }

export function sortTasksWithinGroup(tasks: AssignedTask[], groupBy: GroupBy): AssignedTask[] {
    if (groupBy === "priority") {
        // Within a priority bucket: show active work before done (todo → in_progress → completed)
        return [...tasks].sort((a,b) => (STATUS_SORT[a.status] ?? 99) - (STATUS_SORT[b.status] ?? 99))
    }
    if (groupBy === "status") {
        // Within a status bucket: show most urgent first (high → medium → low)
        return [...tasks].sort((a, b) => (PRIORITY_SORT[a.priority] ?? 99) - (PRIORITY_SORT[b.priority] ?? 99))
    }
    // person - newest first
    return [...tasks].sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}  

export function groupTasks(
    tasks: AssignedTask[],
    by: GroupBy,
    role: "manager" | "worker"
): GroupedAssignedTasks {
    const raw = tasks.reduce((acc, task) => {
        const key = by === "person"
            ? (role === "manager" ? task.assignee_username: task.assigner_username)
            : by === "priority"
            ? task.priority
            : task.status.replace("_", " ")
        if (!acc[key]) acc[key] = []
        acc[key].push(task)
        return acc 
    }, {} as GroupedAssignedTasks)

    const sortedKeys = sortKeys(Object.keys(raw), by)
    return sortedKeys.reduce((acc, key) => {
        acc[key] = sortTasksWithinGroup(raw[key], by)
        return acc
    }, {} as GroupedAssignedTasks)
}