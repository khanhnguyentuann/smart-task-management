/*
    API layer: Only talk to HTTP Client (ApiClient)
    No business logic, just transform response if needed.
*/
import { apiClient } from '@/core/services/api-client'
import { API_ROUTES } from '@/shared/constants'

class ProjectTasksApi {
    async getProjectTasks(projectId: string): Promise<unknown> {
        return apiClient.get(API_ROUTES.PROJECTS.TASKS(projectId))
    }

    async createProjectTask(projectId: string, taskData: any): Promise<unknown> {
        return apiClient.post(API_ROUTES.PROJECTS.TASKS(projectId), taskData)
    }
}

export const projectTasksApi = new ProjectTasksApi()