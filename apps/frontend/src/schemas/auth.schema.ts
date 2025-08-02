import { z } from 'zod';
import { VALIDATION_MESSAGES } from '@/constants/messages';

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, VALIDATION_MESSAGES.EMAIL_REQUIRED)
        .refine((email) => z.email().safeParse(email).success, {
            message: VALIDATION_MESSAGES.EMAIL_INVALID,
        }),
    password: z
        .string()
        .min(1, VALIDATION_MESSAGES.PASSWORD_REQUIRED)
        .min(6, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH),
    remember: z.boolean().default(false),
});

export const registerSchema = z
    .object({
        email: z
            .string()
            .min(1, VALIDATION_MESSAGES.EMAIL_REQUIRED)
            .refine((email) => z.email().safeParse(email).success, {
                message: VALIDATION_MESSAGES.EMAIL_INVALID,
            }),
        password: z
            .string()
            .min(1, VALIDATION_MESSAGES.PASSWORD_REQUIRED)
            .min(6, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH),
        confirmPassword: z
            .string()
            .min(1, VALIDATION_MESSAGES.PASSWORD_CONFIRM_REQUIRED),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: VALIDATION_MESSAGES.PASSWORD_MISMATCH,
        path: ['confirmPassword'],
    });

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, VALIDATION_MESSAGES.PASSWORD_REQUIRED),
        newPassword: z
            .string()
            .min(1, VALIDATION_MESSAGES.PASSWORD_REQUIRED)
            .min(6, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH),
        confirmPassword: z.string().min(1, VALIDATION_MESSAGES.PASSWORD_CONFIRM_REQUIRED),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: VALIDATION_MESSAGES.PASSWORD_MISMATCH,
        path: ['confirmPassword'],
    });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;