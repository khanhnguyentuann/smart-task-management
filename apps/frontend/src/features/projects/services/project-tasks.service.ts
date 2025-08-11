/*
    Service layer: Contains business logic for project tasks
    Call API, handle data transformation, caching...
*/
import { projectTasksApi } from '../api/project-tasks.api'

class ProjectTasksService {
    async getProjectTasks(projectId: string): Promise<any[]> {
        const response = await projectTasksApi.getProjectTasks(projectId)
        
        // Handle paginated response from backend
        const responseData = (response as any).data || response
        let tasksData = responseData
        
        // If response has tasks property (paginated response), extract it
        if (responseData && typeof responseData === 'object' && 'tasks' in responseData) {
            tasksData = responseData.tasks
        }
        
        return Array.isArray(tasksData) ? tasksData : []
    }

    async createProjectTask(projectId: string, taskData: any): Promise<any> {
        const response = await projectTasksApi.createProjectTask(projectId, taskData)
        return (response as any).data || response
    }
}

export const projectTasksService = new ProjectTasksService()