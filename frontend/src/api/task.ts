import client from "./client";
import type { CreateTaskPayload, UpdateTaskPayload } from "../types/task";

export async function getTasks(params?: Record<string, string>) {
    const endpoint = params && Object.keys(params).length > 0 ? "/tasks/filter" : "/tasks/";
    const response = await client.get(endpoint, { params });
    return response.data;
}

export async function createTask(payload: CreateTaskPayload) {
    const response = await client.post("/tasks/", payload);
    return response.data;
}

export async function updateTask(taskId: number, payload: UpdateTaskPayload) {
    const response = await client.patch(`/tasks/${taskId}`, payload);
    return response.data;
}

export async function deleteTask(taskId: number) {
    const response = await client.delete(`/tasks/${taskId}`);
    return response.data;
}

export async function getProductivityReport() {
    const response = await client.get("/tasks/report");
    return response.data;
}