import { apiClient } from '@/core/services/api-client';

export interface TaskAssignee {
    id: string;
    taskId: string;
    userId: string;
    assignedAt: string;
    assignedBy: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        avatar?: string;
    };
    assignedByUser: {
        id: string;
        firstName: string;
        lastName: string;
    };
}

export interface ProjectMember {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
}

export interface AddAssigneeRequest {
    userId: string;
}

export interface ReplaceAssigneesRequest {
    userIds: string[];
}

export const assigneeApi = {
    // Get task assignees
    getTaskAssignees: async (taskId: string): Promise<TaskAssignee[]> => {
        const response = await apiClient.get(`/tasks/${taskId}/assignees`);
        return response.data;
    },

    // Replace all assignees
    replaceTaskAssignees: async (taskId: string, data: ReplaceAssigneesRequest): Promise<TaskAssignee[]> => {
        const response = await apiClient.put(`/tasks/${taskId}/assignees`, data);
        return response.data;
    },

    // Add single assignee
    addTaskAssignee: async (taskId: string, data: AddAssigneeRequest): Promise<TaskAssignee> => {
        const response = await apiClient.post(`/tasks/${taskId}/assignees`, data);
        return response.data;
    },

    // Remove single assignee
    removeTaskAssignee: async (taskId: string, userId: string): Promise<{ message: string }> => {
        const response = await apiClient.delete(`/tasks/${taskId}/assignees/${userId}`);
        return response.data;
    },

    // Get project members for dropdown
    getProjectMembers: async (taskId: string): Promise<ProjectMember[]> => {
        const response = await apiClient.get(`/tasks/${taskId}/project-members`);
        return response.data;
    },
};
