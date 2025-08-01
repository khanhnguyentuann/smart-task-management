export interface ValidationError {
    [key: string]: string | undefined
}

export const validationRules = {
    email: (value: string): string | null => {
        if (!value.trim()) return "Vui lòng nhập email"
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) return "Email không hợp lệ"
        return null
    },

    password: (value: string): string | null => {
        if (!value) return "Vui lòng nhập mật khẩu"
        if (value.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự"
        return null
    },

    confirmPassword: (value: string, password: string): string | null => {
        if (!value) return "Vui lòng xác nhận mật khẩu"
        if (value !== password) return "Mật khẩu không khớp"
        return null
    }
}

export interface LoginFormData {
    email: string
    password: string
    remember: boolean
}

export interface RegisterFormData {
    email: string
    password: string
    confirmPassword: string
}

export function validateLoginForm(data: LoginFormData): ValidationError {
    const errors: ValidationError = {}

    const emailError = validationRules.email(data.email)
    if (emailError) errors.email = emailError

    const passwordError = validationRules.password(data.password)
    if (passwordError) errors.password = passwordError

    return errors
}

export function validateRegisterForm(data: RegisterFormData): ValidationError {
    const errors: ValidationError = {}

    const emailError = validationRules.email(data.email)
    if (emailError) errors.email = emailError

    const passwordError = validationRules.password(data.password)
    if (passwordError) errors.password = passwordError

    const confirmPasswordError = validationRules.confirmPassword(data.confirmPassword, data.password)
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError

    return errors
}