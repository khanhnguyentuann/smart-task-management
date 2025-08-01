import { z } from 'zod';
import { VALIDATION_MESSAGES } from '@/constants/messages';

export const createProjectSchema = z.object({
    name: z
        .string()
        .min(1, VALIDATION_MESSAGES.PROJECT_NAME_REQUIRED)
        .min(3, VALIDATION_MESSAGES.PROJECT_NAME_MIN_LENGTH)
        .max(100),
    description: z.string().max(500).optional(),
    memberIds: z.array(z.string()).optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectFormData = z.infer<typeof createProjectSchema>;
export type UpdateProjectFormData = z.infer<typeof updateProjectSchema>;