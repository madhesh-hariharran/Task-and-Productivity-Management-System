import client from "./client"
import type {
    AssignedTask,
    AssignableUser,
    CreateAssignedTaskPayload,
    UpdateAssignedTaskPayload,
    GroupedAssignedTasks
} from "../types/assigned_task"

// Manager: get tasks they assigned, grouped by assignee username
export async function getAssignedByMe(): Promise<GroupedAssignedTasks> {
    const response = await client.get("/assigned-tasks/created")
    return response.data
}

// Worker/Manager: get tasks assigned to them
export async function getAssignedToMe(): Promise<AssignedTask[]> {
    const response = await client.get("/assigned-tasks/mine")
    return response.data
}

// Manager: get all company members they can assign to
export async function getAssignableUsers(): Promise<AssignableUser[]> {
    const response = await client.get("/assigned-tasks/workers")
    return response.data
}

// Manager: create and assign a task
export async function createAssignedTask(payload: CreateAssignedTaskPayload): Promise<AssignedTask> {
    const response = await client.post("/assigned-tasks/", payload)
    return response.data
}

// Manager or Worker: update status/priority/etc on an assigned task
// JSON.stringify is used explicitly to preserve null values —
// Axios strips null fields from the body by default, which breaks
// the backend's model_fields_set detection for intentional clears
export async function updateAssignedTask(
    taskId: number,
    payload: UpdateAssignedTaskPayload
): Promise<AssignedTask> {
    const response = await client.patch(
        `/assigned-tasks/${taskId}`,
        JSON.stringify(payload),
        { headers: { "Content-Type": "application/json" } }
    )
    return response.data
}

// Manager only: delete an assigned task
export async function deleteAssignedTask(taskId: number): Promise<AssignedTask> {
    const response = await client.delete(`/assigned-tasks/${taskId}`)
    return response.data
}