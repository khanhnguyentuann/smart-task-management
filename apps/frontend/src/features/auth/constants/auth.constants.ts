export const AUTH_CONSTANTS = {
    PASSWORD: {
        MIN_LENGTH: 6,
        MAX_LENGTH: 12,
        STRENGTH_LEVELS: {
            WEAK: 'weak',
            MEDIUM: 'medium',
            STRONG: 'strong'
        } as const
    },

    VALIDATION: {
        EMAIL_INVALID: 'Email không hợp lệ',

        FIRST_NAME_MIN: `Tên phải có ít nhất ${2} ký tự`,
        FIRST_NAME_MAX: `Tên không được vượt quá ${20} ký tự`,
        FIRST_NAME_PATTERN: 'Tên chỉ được chứa chữ cái, khoảng trắng, dấu nháy đơn hoặc gạch ngang',

        LAST_NAME_MIN: `Họ phải có ít nhất ${2} ký tự`,
        LAST_NAME_MAX: `Họ không được vượt quá ${20} ký tự`,
        LAST_NAME_PATTERN: 'Họ chỉ được chứa chữ cái, khoảng trắng, dấu nháy đơn hoặc gạch ngang',

        PASSWORD_MIN: `Mật khẩu phải có ít nhất ${6} ký tự`,
        PASSWORD_MAX: `Mật khẩu không được vượt quá ${12} ký tự`,
        PASSWORD_UPPER: 'Mật khẩu phải chứa ít nhất một chữ hoa',
        PASSWORD_LOWER: 'Mật khẩu phải chứa ít nhất một chữ thường',
        PASSWORD_DIGIT: 'Mật khẩu phải chứa ít nhất một chữ số',
        PASSWORD_SPECIAL: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt (@$!%*?&)',

        CONFIRM_PASSWORD_MISMATCH: "Mật khẩu xác nhận không khớp",
    },

    SOCIAL_PROVIDERS: {
        GOOGLE: 'google',
        FACEBOOK: 'facebook'
    } as const,

    MESSAGES: {
        LOGIN_SUCCESS: '🎉 Welcome back!',
        REGISTER_SUCCESS: '🎉 Account created!',
        LOGOUT_SUCCESS: '👋 See you soon!',
        // Removed unused generic messages to keep constants lean
        SOCIAL_COMING_SOON: '🚀 Coming Soon!'
    },

    ERRORS: {
        LOGIN_FAILED: 'Login failed',
        REGISTER_FAILED: 'Registration failed',
        LOGOUT_FAILED: 'Logout failed',
        INVALID_CREDENTIALS: 'Invalid email or password',
        // Removed unused specific error; surface backend message directly
        NETWORK_ERROR: 'Network error. Please try again.'
    }
} as const

export type PasswordStrength = typeof AUTH_CONSTANTS.PASSWORD.STRENGTH_LEVELS[keyof typeof AUTH_CONSTANTS.PASSWORD.STRENGTH_LEVELS]
export type SocialProvider = typeof AUTH_CONSTANTS.SOCIAL_PROVIDERS[keyof typeof AUTH_CONSTANTS.SOCIAL_PROVIDERS]