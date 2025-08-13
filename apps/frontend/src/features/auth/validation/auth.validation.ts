import { z } from 'zod'
import { AUTH_CONSTANTS, type PasswordStrength } from '@/shared/constants'

// Unified validation schema for Register form
export const registerSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(2, AUTH_CONSTANTS.VALIDATION.FIRST_NAME_MIN)
        .max(20, AUTH_CONSTANTS.VALIDATION.FIRST_NAME_MAX)
        .regex(/^[\p{L}\p{M}\s'-]+$/u, AUTH_CONSTANTS.VALIDATION.FIRST_NAME_PATTERN),
    lastName: z
        .string()
        .trim()
        .min(2, AUTH_CONSTANTS.VALIDATION.LAST_NAME_MIN)
        .max(20, AUTH_CONSTANTS.VALIDATION.LAST_NAME_MAX)
        .regex(/^[\p{L}\p{M}\s'-]+$/u, AUTH_CONSTANTS.VALIDATION.LAST_NAME_PATTERN),
    email: z
        .string()
        .email(AUTH_CONSTANTS.VALIDATION.EMAIL_INVALID),
    password: z
        .string()
        .min(AUTH_CONSTANTS.PASSWORD.MIN_LENGTH, AUTH_CONSTANTS.VALIDATION.PASSWORD_MIN)
        .max(AUTH_CONSTANTS.PASSWORD.MAX_LENGTH, AUTH_CONSTANTS.VALIDATION.PASSWORD_MAX)
        .regex(/[A-Z]/, AUTH_CONSTANTS.VALIDATION.PASSWORD_UPPER)
        .regex(/[a-z]/, AUTH_CONSTANTS.VALIDATION.PASSWORD_LOWER)
        .regex(/\d/, AUTH_CONSTANTS.VALIDATION.PASSWORD_DIGIT)
        .regex(/[@$!%*?&]/, AUTH_CONSTANTS.VALIDATION.PASSWORD_SPECIAL),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: AUTH_CONSTANTS.VALIDATION.CONFIRM_PASSWORD_MISMATCH,
    path: ["confirmPassword"],
})

// Type exports
export type RegisterFormData = z.infer<typeof registerSchema>

// Password strength assessment (for real-time UI)
export interface PasswordValidationResult {
    strength: PasswordStrength
    rules: {
        minOk: boolean
        maxOk: boolean
        upperOk: boolean
        lowerOk: boolean
        digitOk: boolean
        specialOk: boolean
    }
}

export const validatePassword = (password: string): PasswordValidationResult => {
    const { PASSWORD } = AUTH_CONSTANTS
    const { MIN_LENGTH, MAX_LENGTH, STRENGTH_LEVELS } = PASSWORD

    const p = password || ""
    const minOk = p.length >= MIN_LENGTH
    const maxOk = p.length <= MAX_LENGTH
    const lowerOk = /[a-z]/.test(p)
    const upperOk = /[A-Z]/.test(p)
    const digitOk = /\d/.test(p)
    const specialOk = /[@$!%*?&]/.test(p)

    const passedRuleCount = [minOk, maxOk, lowerOk, upperOk, digitOk, specialOk].filter(Boolean).length

    const passwordStrength: PasswordStrength =
        passedRuleCount >= 6
            ? STRENGTH_LEVELS.STRONG
            : passedRuleCount >= 4
                ? STRENGTH_LEVELS.MEDIUM
                : STRENGTH_LEVELS.WEAK

    return {
        strength: passwordStrength,
        rules: { minOk, maxOk, upperOk, lowerOk, digitOk, specialOk },
    }
}

