/*
    API layer: Only talk to HTTP Client (ApiClient)
    No business logic, just transform response if needed.
*/
import { apiClient } from '@/core/services/api-client'
import { API_ROUTES } from '@/core/constants/routes'

class ProjectApi {
    async getProjects(): Promise<unknown> {
        return apiClient.get(API_ROUTES.PROJECTS.LIST)
    }

    async getProject(id: string): Promise<unknown> {
        return apiClient.get(API_ROUTES.PROJECTS.DETAIL(id))
    }

    async createProject(payload: any): Promise<unknown> {
        return apiClient.post(API_ROUTES.PROJECTS.CREATE, payload)
    }

    async updateProject(id: string, payload: any): Promise<unknown> {
        return apiClient.patch(API_ROUTES.PROJECTS.UPDATE(id), payload)
    }

    async deleteProject(id: string): Promise<unknown> {
        return apiClient.delete(API_ROUTES.PROJECTS.DELETE(id))
    }

    async searchProjects(query: string): Promise<unknown> {
        return apiClient.get(`${API_ROUTES.PROJECTS.SEARCH}?q=${encodeURIComponent(query)}`)
    }
}

export const projectApi = new ProjectApi()