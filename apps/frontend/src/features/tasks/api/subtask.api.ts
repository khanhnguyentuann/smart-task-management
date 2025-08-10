/*
    API layer: Subtasks for tasks
*/
import { apiClient } from '@/core/services/api-client'
import type { Subtask, CreateSubtaskPayload, UpdateSubtaskPayload } from '../types'

class SubtaskApi {
    async getTaskSubtasks(taskId: string): Promise<Subtask[]> {
        return apiClient.get<Subtask[]>(`/tasks/${taskId}/subtasks`)
    }

    async addSubtask(taskId: string, payload: CreateSubtaskPayload): Promise<Subtask> {
        return apiClient.post<Subtask>(`/tasks/${taskId}/subtasks`, payload)
    }

    async updateSubtask(taskId: string, subtaskId: string, payload: UpdateSubtaskPayload): Promise<Subtask> {
        return apiClient.put<Subtask>(`/tasks/${taskId}/subtasks/${subtaskId}`, payload)
    }

    async deleteSubtask(taskId: string, subtaskId: string): Promise<void> {
        await apiClient.delete(`/tasks/${taskId}/subtasks/${subtaskId}`)
    }

    async toggleSubtask(taskId: string, subtaskId: string): Promise<Subtask> {
        return apiClient.patch<Subtask>(`/tasks/${taskId}/subtasks/${subtaskId}/toggle`)
    }
}

export const subtaskApi = new SubtaskApi()
