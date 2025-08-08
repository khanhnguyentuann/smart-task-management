import { apiService } from '@/shared/services/api'
import type { Project, CreateProjectData, UpdateProjectData } from '../types'

class ProjectsApi {
    async getProjects(): Promise<Project[]> {
        const response = await apiService.getProjects()
        const projectsData = (response as any).data || response
        return this.transformProjectsResponse(projectsData)
    }

    async createProject(projectData: CreateProjectData): Promise<Project> {
        try {
            const response = await apiService.createProject({
                name: projectData.name,
                description: projectData.description,
                priority: projectData.priority,
                color: projectData.color,
                startDate: projectData.startDate,
                endDate: projectData.endDate,
                memberIds: projectData.memberIds,
                templateTasks: projectData.templateTasks,
            })
            // Backend wraps response in { success: true, data: ..., timestamp: ... }
            const actualProjectData = (response as any).data || response
            return this.transformProjectResponse(actualProjectData)
        } catch (error) {
            throw new Error(`Failed to transform project data: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    async getProject(id: string): Promise<Project> {
        const response = await apiService.getProject(id)
        const projectData = (response as any).data || response
        return this.transformProjectResponse(projectData)
    }

    async updateProject(id: string, projectData: UpdateProjectData): Promise<Project> {
        const response = await apiService.updateProject(id, projectData)
        const actualProjectData = (response as any).data || response
        return this.transformProjectResponse(actualProjectData)
    }

    async deleteProject(id: string): Promise<void> {
        await apiService.deleteProject(id)
    }

    async searchProjects(query: string): Promise<Project[]> {
        const response = await apiService.searchProjects(query)
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
                members: project.projectUsers?.map((pu: any) => ({
                    user: {
                        id: pu.user?.id || '',
                        firstName: pu.user?.firstName || '',
                        lastName: pu.user?.lastName || '',
                        email: pu.user?.email || '',
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
                    deadline: task.deadline,
                })) || [],
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
                // Frontend-specific fields
                userRole: project.ownerId === project.currentUserId ? 'Owner' : 'Member',
                memberCount: project.projectUsers?.length || 0,
                taskStats: this.calculateTaskStats(project.tasks || [])
            }
        } catch (error) {
            throw new Error(`Failed to transform project data: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    private getProjectColor(projectId: string): string {
        const colors = [
            'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500',
            'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-yellow-500'
        ]

        if (!projectId || typeof projectId !== 'string') {
            return colors[0] // Default to first color
        }

        const index = projectId.charCodeAt(0) % colors.length
        return colors[index]
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

export const projectsApi = new ProjectsApi() 