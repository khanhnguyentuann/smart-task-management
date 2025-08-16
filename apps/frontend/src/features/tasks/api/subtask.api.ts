/*
    API layer: Subtasks for tasks
*/
import { apiClient } from '@/core/services/api-client'
import { API_ROUTES } from '@/shared/constants'

export interface TaskSubtask {
    id: string;
    title: string;
    description?: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    dueDate?: string;
    projectId: string;
    parentTaskId: string;
    createdById: string;
    createdAt: string;
    updatedAt: string;
    assignees: Array<{
        userId: string;
        user: {
            id: string;
            email: string;
            avatar?: string;
            firstName: string;
            lastName: string;
        };
    }>;
    createdBy: {
        id: string;
        email: string;
    };
}

export interface CreateSubtaskRequest {
    title: string;
    description?: string;
    status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    dueDate?: string;
}

export interface UpdateSubtaskRequest {
    title?: string;
    description?: string;
    status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    dueDate?: string;
}

export const subtaskApi = {
    // Get task subtasks
    getTaskSubtasks: async (taskId: string): Promise<TaskSubtask[]> => {
        const data = await apiClient.get<TaskSubtask[]>(API_ROUTES.TASKS.SUBTASKS(taskId));
        return data;
    },

    // Create subtask
    createSubtask: async (taskId: string, data: CreateSubtaskRequest): Promise<TaskSubtask> => {
        const response = await apiClient.post<TaskSubtask>(API_ROUTES.TASKS.SUBTASKS(taskId), data);
        return response;
    },

    // Update subtask
    updateSubtask: async (taskId: string, subtaskId: string, data: UpdateSubtaskRequest): Promise<TaskSubtask> => {
        const response = await apiClient.patch<TaskSubtask>(`${API_ROUTES.TASKS.SUBTASKS(taskId)}/${subtaskId}`, data);
        return response;
    },

    // Delete subtask
    deleteSubtask: async (taskId: string, subtaskId: string): Promise<{ message: string }> => {
        const response = await apiClient.delete<{ message: string }>(`${API_ROUTES.TASKS.SUBTASKS(taskId)}/${subtaskId}`);
        return response;
    },
}
