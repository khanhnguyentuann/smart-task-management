/*
    Service layer: Contains business logic for projects
    Call API, handle data transformation, caching...
*/
import { projectApi } from '../api/project.api'
import { mapApiProjectToUi } from '../lib/mappers'
import type { Project, CreateProjectData, UpdateProjectData } from '../lib'

class ProjectService {
    async getProjects(): Promise<Project[]> {
        const response = await projectApi.getProjects()
        const projectsData = (response as any).data || response
        return this.transformProjectsResponse(projectsData)
    }

    async getProject(id: string): Promise<Project> {
        const response = await projectApi.getProject(id)
        const projectData = (response as any).data || response
        return this.transformProjectResponse(projectData)
    }

    async createProject(projectData: CreateProjectData): Promise<Project> {
        try {
            const response = await projectApi.createProject({
                name: projectData.name,
                description: projectData.description,
                priority: projectData.priority,
                color: projectData.color,
                startDate: projectData.startDate,
                endDate: projectData.endDate,
                memberIds: projectData.memberIds,
                templateTasks: projectData.templateTasks,
            })
            const actualProjectData = (response as any).data || response
            return this.transformProjectResponse(actualProjectData)
        } catch (error) {
            throw new Error(`Failed to transform project data: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    async updateProject(id: string, projectData: UpdateProjectData): Promise<Project> {
        const response = await projectApi.updateProject(id, projectData)
        const actualProjectData = (response as any).data || response
        return this.transformProjectResponse(actualProjectData)
    }

    async deleteProject(id: string): Promise<void> {
        await projectApi.deleteProject(id)
    }

    async searchProjects(query: string): Promise<Project[]> {
        const response = await projectApi.searchProjects(query)
        const projectsData = (response as any).data || response
        return this.transformProjectsResponse(projectsData)
    }

    private transformProjectsResponse(response: any): Project[] {
        return response.map((project: any) => this.transformProjectResponse(project))
    }

    private transformProjectResponse(project: any): Project {
        if (!project) {
            throw new Error('Invalid project data received')
        }

        try {
            if (!project.id) {
                throw new Error('Project ID is missing')
            }
            
            return {
                id: project.id,
                name: project.name,
                description: project.description,
                priority: this.normalizePriorityForFrontend(project.priority) || 'Medium',
                color: project.color || 'bg-blue-500',
                startDate: project.startDate,
                endDate: project.endDate,
                ownerId: project.ownerId,
                owner: project.owner ? {
                    id: project.owner.id,
                    firstName: project.owner.firstName,
                    lastName: project.owner.lastName,
                    email: project.owner.email,
                } : {
                    id: '',
                    firstName: '',
                    lastName: '',
                    email: '',
                },
                members: project.members?.map((m: any) => ({
                    user: {
                        id: m.user?.id || '',
                        firstName: m.user?.firstName || '',
                        lastName: m.user?.lastName || '',
                        email: m.user?.email || '',
                        avatar: m.user?.avatar || '',
                    },
                    joinedAt: m.joinedAt,
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
                        email: task.assignee.email,
                        avatar: task.assignee.avatar,
                    } : null,
                    createdAt: task.createdAt,
                    updatedAt: task.updatedAt,
                    deadline: task.dueDate || task.deadline,
                })) || [],
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
                // Frontend-specific fields
                userRole: project.ownerId === project.currentUserId ? 'Owner' : 'Member',
                memberCount: project.memberCount || project._count?.members || (project.members?.length || 0) + 1, // Use backend count or calculate including owner
                taskStats: this.calculateTaskStats(project.tasks || [])
            }
        } catch (error) {
            throw new Error(`Failed to transform project data: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    private normalizePriorityForFrontend(priority: string): 'Low' | 'Medium' | 'High' {
        if (!priority) return 'Medium'
        const normalized = priority.toLowerCase()
        if (normalized === 'low') return 'Low'
        if (normalized === 'medium') return 'Medium'
        if (normalized === 'high') return 'High'
        return 'Medium'
    }

    private calculateTaskStats(tasks: any[]): { todo: number; inProgress: number; done: number } {
        return {
            todo: tasks.filter(task => task.status === 'TODO').length,
            inProgress: tasks.filter(task => task.status === 'IN_PROGRESS').length,
            done: tasks.filter(task => task.status === 'DONE').length
        }
    }
}

export const projectService = new ProjectService()