import { z } from 'zod'
import { PROJECTS_CONSTANTS } from './constants'

// Schema for creating a project
export const createProjectSchema = z.object({
    name: z
        .string()
        .min(PROJECTS_CONSTANTS.LIMITS.MIN_NAME_LENGTH, `Project name must be at least ${PROJECTS_CONSTANTS.LIMITS.MIN_NAME_LENGTH} characters`)
        .max(PROJECTS_CONSTANTS.LIMITS.MAX_NAME_LENGTH, `Project name must be less than ${PROJECTS_CONSTANTS.LIMITS.MAX_NAME_LENGTH} characters`),
    description: z
        .string()
        .max(PROJECTS_CONSTANTS.LIMITS.MAX_DESCRIPTION_LENGTH, `Description must be less than ${PROJECTS_CONSTANTS.LIMITS.MAX_DESCRIPTION_LENGTH} characters`)
        .optional(),
    priority: z.enum(['Low', 'Medium', 'High']).optional(),
    color: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional().nullable(),
    memberIds: z.array(z.string()).optional(),
    templateTasks: z.array(z.object({
        title: z.string(),
        description: z.string(),
        priority: z.enum(['Low', 'Medium', 'High'])
    })).optional()
})

// Schema for updating a project
export const updateProjectSchema = z.object({
    name: z
        .string()
        .min(PROJECTS_CONSTANTS.LIMITS.MIN_NAME_LENGTH, `Project name must be at least ${PROJECTS_CONSTANTS.LIMITS.MIN_NAME_LENGTH} characters`)
        .max(PROJECTS_CONSTANTS.LIMITS.MAX_NAME_LENGTH, `Project name must be less than ${PROJECTS_CONSTANTS.LIMITS.MAX_NAME_LENGTH} characters`),
    description: z
        .string()
        .max(PROJECTS_CONSTANTS.LIMITS.MAX_DESCRIPTION_LENGTH, `Description must be less than ${PROJECTS_CONSTANTS.LIMITS.MAX_DESCRIPTION_LENGTH} characters`)
        .optional(),
    priority: z.enum(['Low', 'Medium', 'High']).optional(),
    color: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional().nullable()
})

// Schema for search
export const searchProjectSchema = z.object({
    query: z
        .string()
        .min(PROJECTS_CONSTANTS.LIMITS.SEARCH_MIN_LENGTH, 'Search query must be at least 3 characters')
})

// Schema for delete project confirmation
export const deleteProjectSchema = z.object({
    projectName: z.string().min(1, 'Project name is required'),
    confirmationText: z.string().min(1, 'Confirmation text is required')
}).refine((data) => data.confirmationText === data.projectName, {
    message: 'Confirmation text must match project name exactly',
    path: ['confirmationText']
})

// Type exports
export type CreateProjectFormData = z.infer<typeof createProjectSchema>
export type UpdateProjectFormData = z.infer<typeof updateProjectSchema>
export type SearchProjectFormData = z.infer<typeof searchProjectSchema>
export type DeleteProjectFormData = z.infer<typeof deleteProjectSchema>

// Validation functions
export const validateCreateProject = (data: unknown) => {
    return createProjectSchema.safeParse(data)
}

export const validateUpdateProject = (data: unknown) => {
    return updateProjectSchema.safeParse(data)
}

export const validateSearchQuery = (query: string) => {
    return searchProjectSchema.safeParse({ query })
}

export const validateDeleteProject = (data: unknown) => {
    return deleteProjectSchema.safeParse(data)
}
