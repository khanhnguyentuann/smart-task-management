import { apiService } from '@/shared/services/api'
import type { Project, CreateProjectData, UpdateProjectData } from '../types'

class ProjectsApi {
    async getProjects(): Promise<Project[]> {
        const response = await apiService.getProjects()
        return this.transformProjectsResponse(response)
    }

    async createProject(projectData: CreateProjectData): Promise<Project> {
        const response = await apiService.createProject(projectData)
        return this.transformProjectResponse(response)
    }

    async getProject(id: string): Promise<Project> {
        const response = await apiService.getProject(id)
        return this.transformProjectResponse(response)
    }

    async updateProject(id: string, projectData: UpdateProjectData): Promise<Project> {
        const response = await apiService.updateProject(id, projectData)
        return this.transformProjectResponse(response)
    }

    async deleteProject(id: string): Promise<void> {
        await apiService.deleteProject(id)
    }

    private transformProjectsResponse(response: any): Project[] {
        return response.map((project: any) => this.transformProjectResponse(project))
    }

    private transformProjectResponse(project: any): Project {
        return {
            id: project.id,
            name: project.name,
            description: project.description,
            ownerId: project.ownerId,
            owner: {
                id: project.owner.id,
                firstName: project.owner.firstName,
                lastName: project.owner.lastName,
                email: project.owner.email,
            },
            members: project.projectUsers?.map((pu: any) => ({
                user: {
                    id: pu.user.id,
                    firstName: pu.user.firstName,
                    lastName: pu.user.lastName,
                    email: pu.user.email,
                },
                joinedAt: pu.joinedAt,
            })) || [],
            tasks: project.tasks?.map((task: any) => ({
                id: task.id,
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                assigneeId: task.assigneeId,
                assignee: task.assignee ? {
                    id: task.assignee.id,
                    firstName: task.assignee.firstName,
                    lastName: task.assignee.lastName,
                } : undefined,
                createdAt: task.createdAt,
                updatedAt: task.updatedAt,
            })) || [],
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
            // Frontend-specific fields
            userRole: project.ownerId === project.currentUserId ? 'Owner' : 'Member',
            color: this.getProjectColor(project.id),
            memberCount: project.projectUsers?.length || 0,
            taskStats: this.calculateTaskStats(project.tasks || [])
        }
    }

    private getProjectColor(projectId: string): string {
        const colors = [
            'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500',
            'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-yellow-500'
        ]
        const index = projectId.charCodeAt(0) % colors.length
        return colors[index]
    }

    private calculateTaskStats(tasks: any[]): { todo: number; inProgress: number; done: number } {
        return {
            todo: tasks.filter(task => task.status === 'TODO').length,
            inProgress: tasks.filter(task => task.status === 'IN_PROGRESS').length,
            done: tasks.filter(task => task.status === 'DONE').length
        }
    }
}

export const projectsApi = new ProjectsApi() 