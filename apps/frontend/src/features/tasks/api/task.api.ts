/*
    API layer: Only talk to HTTP Client (ApiClient)
    No business logic, just transform response if needed.
*/
import { apiClient } from '@/core/services/api-client'
import { API_ROUTES } from '@/shared/constants'
import type { Task, CreateTaskPayload, UpdateTaskPayload } from '../types'

class TaskApi {
    // ==========================================
    // TASK CRUD OPERATIONS
    // ==========================================
    
    async getAllTasks(): Promise<Task[]> {
        return apiClient.get<Task[]>(API_ROUTES.TASKS.ALL)
    }

    async getTaskById(id: string): Promise<Task> {
        return apiClient.get<Task>(API_ROUTES.TASKS.DETAIL(id))
    }

    async createNewTask(payload: CreateTaskPayload): Promise<Task> {
        return apiClient.post<Task>(API_ROUTES.TASKS.CREATE, payload)
    }

    async updateTaskById(id: string, payload: UpdateTaskPayload): Promise<Task> {
        return apiClient.patch<Task>(API_ROUTES.TASKS.UPDATE(id), payload)
    }

    async deleteTaskById(id: string): Promise<void> {
        await apiClient.delete(API_ROUTES.TASKS.DELETE(id))
    }

    // ==========================================
    // USER TASKS
    // ==========================================
    
    async getMyAssignedTasks(): Promise<Task[]> {
        return apiClient.get<Task[]>(API_ROUTES.TASKS.LIST)
    }

    // ==========================================
    // TASK ACTIONS
    // ==========================================
    
    async updateTaskStatusById(id: string, status: string): Promise<Task> {
        return apiClient.patch<Task>(API_ROUTES.TASKS.STATUS(id), { status })
    }



    async archiveTaskById(id: string): Promise<{ message: string }> {
        return apiClient.post<{ message: string }>(API_ROUTES.TASKS.ARCHIVE(id))
    }

    async restoreTaskById(id: string): Promise<{ message: string }> {
        return apiClient.post<{ message: string }>(API_ROUTES.TASKS.RESTORE(id))
    }
}

export const taskApi = new TaskApi()
