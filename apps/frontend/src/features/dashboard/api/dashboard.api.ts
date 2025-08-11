import { apiClient } from "@/core/services/api-client"
import { DASHBOARD_API_ROUTES } from "../lib/constants"

export const dashboardApi = {
    async getProjects() {
        return apiClient.get(DASHBOARD_API_ROUTES.PROJECTS)
    },

    async getTasks() {
        return apiClient.get(DASHBOARD_API_ROUTES.TASKS)
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
