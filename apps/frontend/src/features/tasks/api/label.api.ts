/*
    API layer: Only talk to HTTP Client (ApiClient)
    No business logic, just transform response if needed.
*/
import { apiClient } from '@/core/services/api-client'
import { API_ROUTES } from '@/shared/constants'

export interface TaskLabel {
    id: string;
    name: string;
    color: string;
    taskId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateLabelRequest {
    name: string;
    color: string;
}

export interface UpdateLabelRequest {
    name?: string;
    color?: string;
}

export const labelApi = {
    // Get task labels
    getTaskLabels: async (taskId: string): Promise<TaskLabel[]> => {
        const data = await apiClient.get<TaskLabel[]>(API_ROUTES.TASKS.LABELS(taskId));
        return data;
    },

    // Create new label
    createTaskLabel: async (taskId: string, data: CreateLabelRequest): Promise<TaskLabel> => {
        const response = await apiClient.post<TaskLabel>(API_ROUTES.TASKS.LABELS(taskId), data);
        return response;
    },

    // Update label
    updateTaskLabel: async (taskId: string, labelId: string, data: UpdateLabelRequest): Promise<TaskLabel> => {
        const response = await apiClient.patch<TaskLabel>(`${API_ROUTES.TASKS.LABELS(taskId)}/${labelId}`, data);
        return response;
    },

    // Delete label
    deleteTaskLabel: async (taskId: string, labelId: string): Promise<{ message: string }> => {
        const response = await apiClient.delete<{ message: string }>(`${API_ROUTES.TASKS.LABELS(taskId)}/${labelId}`);
        return response;
    },
}
