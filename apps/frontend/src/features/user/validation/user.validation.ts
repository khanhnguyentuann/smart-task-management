import { z } from 'zod'

export const updateProfileSchema = z.object({
    firstName: z.string().trim().min(2).max(20).regex(/^[\p{L}\p{M}\s'-]+$/u).optional(),
    lastName: z.string().trim().min(2).max(20).regex(/^[\p{L}\p{M}\s'-]+$/u).optional(),
    department: z.string().trim().max(50).optional(),
    dateOfBirth: z.string().optional().or(z.literal('')),
}).refine((data) => Boolean(data.firstName || data.lastName || data.department || data.dateOfBirth), {
    message: 'No changes provided'
})

export type UpdateProfileForm = z.infer<typeof updateProfileSchema>

// Avatar upload validation (separated)
export const uploadAvatarSchema = z.object({
    avatar: z.string().url().or(z.string().startsWith('data:image/')),
})


