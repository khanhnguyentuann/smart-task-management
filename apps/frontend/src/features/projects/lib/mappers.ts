import { Task } from '@/features/tasks/types'
import type { Project, ProjectMember } from './types'

// API to UI mappers
export const mapApiProjectToUi = (apiProject: any): Project => {
    return {
        id: apiProject.id,
        name: apiProject.name,
        description: apiProject.description || '',
        color: apiProject.color || '#3b82f6',
        priority: apiProject.priority || 'Medium',
        startDate: apiProject.startDate || undefined,
        endDate: apiProject.endDate || undefined,
        ownerId: apiProject.ownerId,
        owner: apiProject.owner,
        members: apiProject.members?.map(mapApiMemberToUi) || [],
        tasks: apiProject.tasks?.map(mapApiTaskToUi) || [],
        createdAt: apiProject.createdAt,
        updatedAt: apiProject.updatedAt,
        userRole: apiProject.userRole || 'Member',
        memberCount: apiProject.memberCount || 0,
        taskStats: apiProject.taskStats || { todo: 0, inProgress: 0, done: 0 },
    }
}

export const mapApiMemberToUi = (apiMember: any): ProjectMember => {
    return {
        user: {
            id: apiMember.user.id,
            firstName: apiMember.user.firstName,
            lastName: apiMember.user.lastName,
            email: apiMember.user.email,
            avatar: apiMember.user.avatar || '',
        },
        joinedAt: apiMember.joinedAt,
    }
}

export const mapApiTaskToUi = (apiTask: any): Task => {
    return {
        id: apiTask.id,
        title: apiTask.title,
        description: apiTask.description || '',
        aiSummary: apiTask.summary || '',
        priority: apiTask.priority || 'MEDIUM',
        assignee: apiTask.assignee ? {
            id: apiTask.assignee.id,
            name: `${apiTask.assignee.firstName} ${apiTask.assignee.lastName}`,
            avatar: apiTask.assignee.avatar || '',
            email: apiTask.assignee.email,
        } : {
            id: undefined,
            name: 'Unassigned',
            avatar: '',
            email: undefined,
        },
        deadline: apiTask.dueDate,
        dueDate: apiTask.dueDate ? new Date(apiTask.dueDate) : null,
        status: apiTask.status || 'TODO',
        project: apiTask.projectId || '',
        projectId: apiTask.projectId,
        createdAt: new Date(apiTask.createdAt),
        updatedAt: new Date(apiTask.updatedAt),
    }
}

// UI to API mappers
export const mapUiProjectToApi = (uiProject: Partial<Project>): any => {
    return {
        name: uiProject.name,
        description: uiProject.description,
        color: uiProject.color,
        priority: uiProject.priority,
        startDate: uiProject.startDate,
        endDate: uiProject.endDate,
    }
}

export const mapUiTaskToApi = (uiTask: Partial<Task>): any => {
    return {
        title: uiTask.title,
        description: uiTask.description,
        status: uiTask.status,
        priority: uiTask.priority,
        dueDate: uiTask.dueDate?.toISOString(),
        assigneeId: uiTask.assignee?.id,
    }
}
