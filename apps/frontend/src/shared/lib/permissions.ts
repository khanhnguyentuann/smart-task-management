// Permission helper utilities for consistent permission checking across the app

export interface ProjectPermissions {
    canEditProject: boolean
    canDeleteProject: boolean
    canManageMembers: boolean
    canCreateTask: boolean
    canViewTasks: boolean
    canViewProject: boolean
    isOwner: boolean
    isMember: boolean
}

export interface TaskPermissions {
    canEdit: boolean
    canDelete: boolean
    canComment: boolean
    canAssign: boolean
    canChangeStatus: boolean
}

/**
 * Get project-level permissions for a user
 */
export const getProjectPermissions = (project: any, user: any): ProjectPermissions => {
    const isOwner = project?.ownerId === user?.id
    const isMember = project?.members?.some((m: any) => m.userId === user?.id || m.user?.id === user?.id)

    return {
        // Project management - Only Owner
        canEditProject: isOwner,
        canDeleteProject: isOwner,
        canManageMembers: isOwner,

        // Task management - Owner + Members
        canCreateTask: isMember || isOwner,
        canViewTasks: isMember || isOwner,

        // General access
        canViewProject: isMember || isOwner,
        isOwner,
        isMember: isMember || isOwner
    }
}

/**
 * Get task-level permissions for a user
 */
export const getTaskPermissions = (task: any, user: any, project?: any): TaskPermissions => {
    const isProjectOwner = project?.ownerId === user?.id || task?.project?.ownerId === user?.id
    const isTaskCreator = task?.createdById === user?.id
    const isTaskAssignee = task?.assigneeId === user?.id

    return {
        // Edit permissions: Owner can edit ALL, Members can edit tasks they created OR are assigned to
        canEdit: isProjectOwner || isTaskCreator || isTaskAssignee,

        // Delete permissions: Owner can delete ALL, Members can ONLY delete tasks they created (NOT assigned)
        canDelete: isProjectOwner || isTaskCreator,

        // Comment permissions: All members can comment
        canComment: true,

        // Assignment permissions: Owner and task creator can assign
        canAssign: isProjectOwner || isTaskCreator,

        // Status change permissions: Same as edit
        canChangeStatus: isProjectOwner || isTaskCreator || isTaskAssignee
    }
}

/**
 * Check if user can view a project
 */
export const canUserViewProject = (project: any, user: any): boolean => {
    const { canViewProject } = getProjectPermissions(project, user)
    return canViewProject
}

/**
 * Check if user can manage project members
 */
export const canUserManageMembers = (project: any, user: any): boolean => {
    const { canManageMembers } = getProjectPermissions(project, user)
    return canManageMembers
}

/**
 * Check if user can edit a specific task
 */
export const canUserEditTask = (task: any, user: any, project?: any): boolean => {
    const { canEdit } = getTaskPermissions(task, user, project)
    return canEdit
}

/**
 * Check if user can delete a specific task
 */
export const canUserDeleteTask = (task: any, user: any, project?: any): boolean => {
    const { canDelete } = getTaskPermissions(task, user, project)
    return canDelete
}
