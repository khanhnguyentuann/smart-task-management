/*
    Service layer: Contains business logic for project tasks
    Call API, handle data transformation, caching...
*/
import { projectTasksApi } from '../api/project-tasks.api'

class ProjectTasksService {
    async getProjectTasks(projectId: string): Promise<any[]> {
        const response = await projectTasksApi.getProjectTasks(projectId)
        const tasksData = (response as any).data || response
        return Array.isArray(tasksData) ? tasksData : []
    }

    async createProjectTask(projectId: string, taskData: any): Promise<any> {
        const response = await projectTasksApi.createProjectTask(projectId, taskData)
        return (response as any).data || response
    }
}

export const projectTasksService = new ProjectTasksService()