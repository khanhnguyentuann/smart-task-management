/*
    Service layer: Contains business logic for project members
    Call API, handle data transformation, caching...
*/
import { projectMembersApi } from '../api/project-members.api'

class ProjectMembersService {
    async addProjectMembers(projectId: string, memberIds: string[]): Promise<any> {
        const response = await projectMembersApi.addProjectMembers(projectId, memberIds)
        return (response as any).data || response
    }

    async removeProjectMember(projectId: string, memberId: string): Promise<void> {
        await projectMembersApi.removeProjectMember(projectId, memberId)
    }
}

export const projectMembersService = new ProjectMembersService()