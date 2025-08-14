/*
    API layer: Only talk to HTTP Client (ApiClient)
    No business logic, just transform response if needed.
*/
import { apiClient } from '@/core/services/api-client'
import { API_ROUTES } from '@/shared/constants'
import type { Task, CreateTaskPayload, UpdateTaskPayload } from '../types'

class TaskApi {
    async getTasks(): Promise<Task[]> {
        return apiClient.get<Task[]>('/tasks')
    }

    async getTask(id: string): Promise<Task> {
        return apiClient.get<Task>(`/tasks/${id}`)
    }

    async createTask(payload: CreateTaskPayload): Promise<Task> {
        return apiClient.post<Task>('/tasks', payload)
    }

    async updateTask(id: string, payload: UpdateTaskPayload): Promise<Task> {
        return apiClient.patch<Task>(`/tasks/${id}`, payload)
    }

    async deleteTask(id: string): Promise<void> {
        await apiClient.delete(`/tasks/${id}`)
    }

    async getMyTasks(): Promise<Task[]> {
        return apiClient.get<Task[]>('/users/me/tasks')
    }

    async updateTaskStatus(id: string, status: string): Promise<Task> {
        return apiClient.patch<Task>(`/tasks/${id}/status`, { status })
    }

    async assignTask(id: string, userId: string): Promise<Task> {
        return apiClient.patch<Task>(`/tasks/${id}/assign`, { userId })
    }
}

export const taskApi = new TaskApi()
