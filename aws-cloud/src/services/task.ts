import { config } from "../config/api";
import type { Task, TasksCreate, TasksUdate } from "../config/types/tasks";

export async function service_post_tasks(task: TasksCreate): Promise<Task> {
    const response = await fetch(`${config.apiUrl}/tasks/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    })
    return response.json()
}

export async function service_get_tasks(): Promise<Task[]> {
    const response = await fetch(`${config.apiUrl}/tasks/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    return response.json()
}

export async function service_update_task(id: number, task: TasksUdate): Promise<Task> {
    const response = await fetch(`${config.apiUrl}/tasks/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    })
    return response.json()
}

export async function service_delete_task(id: number): Promise<void> {
    await fetch(`${config.apiUrl}/tasks/${id}/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
}
