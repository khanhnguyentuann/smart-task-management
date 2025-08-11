/*
    API layer: Only talk to HTTP Client (ApiClient)
    No business logic, just transform response if needed.
*/
import { apiClient } from '@/core/services/api-client'
import { API_ROUTES } from '@/core/constants/routes'

class ProjectMembersApi {
    async addProjectMembers(projectId: string, memberIds: string[]): Promise<unknown> {
        return apiClient.post(API_ROUTES.PROJECTS.MEMBERS.ADD(projectId), { userIds: memberIds })
    }

    async removeProjectMember(projectId: string, memberId: string): Promise<unknown> {
        return apiClient.delete(API_ROUTES.PROJECTS.MEMBERS.REMOVE(projectId, memberId))
    }
}

export const projectMembersApi = new ProjectMembersApi()