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
        EMAIL_INVALID: 'Invalid email address',

        FIRST_NAME_MIN: `First name must be at least ${2} characters`,
        FIRST_NAME_MAX: `First name must be at most ${20} characters`,
        FIRST_NAME_PATTERN: 'First name must contain only letters, spaces, apostrophes or hyphens',

        LAST_NAME_MIN: `Last name must be at least ${2} characters`,
        LAST_NAME_MAX: `Last name must be at most ${20} characters`,
        LAST_NAME_PATTERN: 'Last name must contain only letters, spaces, apostrophes or hyphens',

        PASSWORD_MIN: `Password must be at least ${6} characters`,
        PASSWORD_MAX: `Password must be at most ${12} characters`,
        PASSWORD_UPPER: 'Password must contain at least one uppercase letter',
        PASSWORD_LOWER: 'Password must contain at least one lowercase letter',
        PASSWORD_DIGIT: 'Password must contain at least one number',
        PASSWORD_SPECIAL: 'Password must contain at least one special character (@$!%*?&)',

        CONFIRM_PASSWORD_MISMATCH: "Passwords don't match",
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