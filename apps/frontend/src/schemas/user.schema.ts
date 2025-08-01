import { z } from 'zod';

export const userRoleSchema = z.enum(['ADMIN', 'MEMBER']);

export const userSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    role: userRoleSchema,
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    avatar: z.string().url().optional(),
    createdAt: z.string(),
});

export const updateProfileSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    avatar: z.string().url().optional(),
});

export type UserRole = z.infer<typeof userRoleSchema>;
export type User = z.infer<typeof userSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;