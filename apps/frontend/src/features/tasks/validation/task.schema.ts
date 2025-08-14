import { z } from 'zod'

// Task Update Schema
export const updateTaskSchema = z.object({
    title: z.string()
        .min(3, 'Task title must be at least 3 characters')
        .max(200, 'Task title must not exceed 200 characters')
        .optional(),

    description: z.string()
        .max(2000, 'Description must not exceed 2000 characters')
        .optional(),

    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE'])
        .optional(),

    priority: z.enum(['HIGH', 'MEDIUM', 'LOW'])
        .optional(),

    dueDate: z.string().optional().nullable()
})

export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>

// Create Task Schema
export const createTaskSchema = z.object({
    title: z.string()
        .min(3, 'Task title must be at least 3 characters')
        .max(200, 'Task title must not exceed 200 characters'),

    description: z.string()
        .max(2000, 'Description must not exceed 2000 characters')
        .optional(),

    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE'])
        .default('TODO'),

    priority: z.enum(['HIGH', 'MEDIUM', 'LOW'])
        .default('MEDIUM'),

    projectId: z.string().uuid(),

    dueDate: z.string().optional()
})

export type CreateTaskFormData = z.infer<typeof createTaskSchema>