import { z } from 'zod'
import { AUTH_CONSTANTS, type PasswordStrength } from '../constants'

// Zod schemas
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
})

export const registerSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(AUTH_CONSTANTS.PASSWORD.MIN_LENGTH, `Password must be at least ${AUTH_CONSTANTS.PASSWORD.MIN_LENGTH} characters`),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
})

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>

// Password validation
export interface PasswordValidationResult {
    isValid: boolean
    errors: string[]
    strength: PasswordStrength
}

export const validatePassword = (password: string): PasswordValidationResult => {
    const errors: string[] = []

    if (password.length < AUTH_CONSTANTS.PASSWORD.MIN_LENGTH) {
        errors.push(`Password must be at least ${AUTH_CONSTANTS.PASSWORD.MIN_LENGTH} characters long`)
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter')
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter')
    }

    if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number')
    }

    if (!/[@$!%*?&]/.test(password)) {
        errors.push('Password must contain at least one special character (@$!%*?&)')
    }

    const criteriaMet = [
        password.length >= AUTH_CONSTANTS.PASSWORD.MIN_LENGTH,
        /[a-z]/.test(password),
        /[A-Z]/.test(password),
        /\d/.test(password),
        /[@$!%*?&]/.test(password)
    ].filter(Boolean).length

    let strength: PasswordStrength = AUTH_CONSTANTS.PASSWORD.STRENGTH_LEVELS.WEAK
    if (criteriaMet >= 5) {
        strength = AUTH_CONSTANTS.PASSWORD.STRENGTH_LEVELS.STRONG
    } else if (criteriaMet >= 3) {
        strength = AUTH_CONSTANTS.PASSWORD.STRENGTH_LEVELS.MEDIUM
    }

    return {
        isValid: errors.length === 0,
        errors,
        strength
    }
}