/*
    API layer: Labels for tasks
*/
import { apiClient } from '@/core/services/api-client'
import type { Label, CreateLabelPayload, UpdateLabelPayload } from '../types'

class LabelApi {
    async getTaskLabels(taskId: string): Promise<Label[]> {
        return apiClient.get<Label[]>(`/tasks/${taskId}/labels`)
    }

    async addLabel(taskId: string, payload: CreateLabelPayload): Promise<Label> {
        return apiClient.post<Label>(`/tasks/${taskId}/labels`, payload)
    }

    async removeLabel(taskId: string, labelId: string): Promise<void> {
        await apiClient.delete(`/tasks/${taskId}/labels/${labelId}`)
    }

    async updateLabel(labelId: string, payload: UpdateLabelPayload): Promise<Label> {
        return apiClient.put<Label>(`/labels/${labelId}`, payload)
    }

    async getProjectLabels(projectId: string): Promise<Label[]> {
        return apiClient.get<Label[]>(`/projects/${projectId}/labels`)
    }

    async createProjectLabel(projectId: string, payload: CreateLabelPayload): Promise<Label> {
        return apiClient.post<Label>(`/projects/${projectId}/labels`, payload)
    }
}

export const labelApi = new LabelApi()
