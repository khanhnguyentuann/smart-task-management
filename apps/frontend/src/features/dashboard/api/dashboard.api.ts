import { apiClient } from "@/core/services/api-client"
import { API_ROUTES } from "@/shared/constants"

export const dashboardApi = {
    async getProjects() {
        return apiClient.get(API_ROUTES.PROJECTS.LIST)
    },

    async getTasks() {
        return apiClient.get(API_ROUTES.TASKS.LIST)
    },

    async getDashboardData() {
        const [projectsResponse, tasksResponse] = await Promise.all([
            this.getProjects(),
            this.getTasks()
        ])

        return {
            projects: (projectsResponse as any) || [],
            tasks: (tasksResponse as any) || []
        }
    }
}
