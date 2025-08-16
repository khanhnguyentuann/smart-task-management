/*
    Service layer: Contains business logic for task assignees
    Call API, handle data transformation, caching...
*/
import { assigneeApi, TaskAssignee, ProjectMember, AddAssigneeRequest, ReplaceAssigneesRequest } from '../api/assignee.api'

class AssigneeService {
    async getTaskAssignees(taskId: string): Promise<TaskAssignee[]> {
        try {
            const response = await assigneeApi.getTaskAssignees(taskId)
            return Array.isArray(response) ? response : []
        } catch (error) {
            console.error('❌ Service: Error fetching task assignees:', error)
            return []
        }
    }

    async replaceTaskAssignees(taskId: string, data: ReplaceAssigneesRequest): Promise<TaskAssignee[]> {
        try {
            const response = await assigneeApi.replaceTaskAssignees(taskId, data)
            return Array.isArray(response) ? response : []
        } catch (error) {
            console.error('❌ Service: Error replacing task assignees:', error)
            throw error
        }
    }

    async addTaskAssignee(taskId: string, data: AddAssigneeRequest): Promise<TaskAssignee> {
        try {
            const response = await assigneeApi.addTaskAssignee(taskId, data)
            return response
        } catch (error) {
            console.error('❌ Service: Error adding task assignee:', error)
            throw error
        }
    }

    async removeTaskAssignee(taskId: string, userId: string): Promise<{ message: string }> {
        try {
            const response = await assigneeApi.removeTaskAssignee(taskId, userId)
            return response
        } catch (error) {
            console.error('❌ Service: Error removing task assignee:', error)
            throw error
        }
    }

    async getProjectMembers(taskId: string): Promise<ProjectMember[]> {
        try {
            const response = await assigneeApi.getProjectMembers(taskId)
            return Array.isArray(response) ? response : []
        } catch (error) {
            console.error('❌ Service: Error fetching project members:', error)
            return []
        }
    }

    // Business logic: Get available members (not already assigned)
    getAvailableMembers(projectMembers: ProjectMember[], assignees: TaskAssignee[]): ProjectMember[] {
        return projectMembers.filter(member => 
            !assignees.some(assignee => assignee.userId === member.id)
        )
    }

    // Business logic: Validate assignee data
    validateAssigneeData(userId: string, projectMembers: ProjectMember[]): boolean {
        return projectMembers.some(member => member.id === userId)
    }
}

export const assigneeService = new AssigneeService()
