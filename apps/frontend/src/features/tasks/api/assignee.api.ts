import { apiClient } from '@/core/services/api-client';
import { API_ROUTES } from '@/shared/constants';

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
        const data = await apiClient.get<TaskAssignee[]>(API_ROUTES.TASKS.ASSIGNEES(taskId));
        return data;
    },

    // Replace all assignees
    replaceTaskAssignees: async (taskId: string, data: ReplaceAssigneesRequest): Promise<TaskAssignee[]> => {
        const response = await apiClient.put(API_ROUTES.TASKS.ASSIGNEES(taskId), data);
        return response.data;
    },

    // Add single assignee
    addTaskAssignee: async (taskId: string, data: AddAssigneeRequest): Promise<TaskAssignee> => {
        const response = await apiClient.post(API_ROUTES.TASKS.ASSIGNEES(taskId), data);
        return response.data;
    },

    // Remove single assignee
    removeTaskAssignee: async (taskId: string, userId: string): Promise<{ message: string }> => {
        const response = await apiClient.delete(`${API_ROUTES.TASKS.ASSIGNEES(taskId)}/${userId}`);
        return response.data;
    },

    // Get project members for dropdown
    getProjectMembers: async (taskId: string): Promise<ProjectMember[]> => {
        const data = await apiClient.get<ProjectMember[]>(API_ROUTES.TASKS.PROJECT_MEMBERS(taskId));
        return data;
    },
};
