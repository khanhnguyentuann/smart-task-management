export const AUTH_CONSTANTS = {
    TOKEN_KEY: 'authToken',
    USER_KEY: 'user',
    REFRESH_TOKEN_KEY: 'refreshToken',

    PASSWORD: {
        MIN_LENGTH: 6,
        STRENGTH_LEVELS: {
            WEAK: 'weak',
            MEDIUM: 'medium',
            STRONG: 'strong'
        } as const
    },

    SOCIAL_PROVIDERS: {
        GOOGLE: 'google',
        FACEBOOK: 'facebook'
    } as const,

    MESSAGES: {
        LOGIN_SUCCESS: '🎉 Welcome back!',
        REGISTER_SUCCESS: '🎉 Account created!',
        LOGOUT_SUCCESS: '👋 See you soon!',
        AUTH_FAILED: '❌ Authentication failed',
        INVALID_PASSWORD: '❌ Invalid password',
        PASSWORD_MISMATCH: "❌ Passwords don't match",
        SOCIAL_COMING_SOON: '🚀 Coming Soon!'
    },

    ERRORS: {
        LOGIN_FAILED: 'Login failed',
        REGISTER_FAILED: 'Registration failed',
        LOGOUT_FAILED: 'Logout failed',
        INVALID_CREDENTIALS: 'Invalid email or password',
        USER_EXISTS: 'User already exists',
        NETWORK_ERROR: 'Network error. Please try again.'
    }
} as const

export type PasswordStrength = typeof AUTH_CONSTANTS.PASSWORD.STRENGTH_LEVELS[keyof typeof AUTH_CONSTANTS.PASSWORD.STRENGTH_LEVELS]
export type SocialProvider = typeof AUTH_CONSTANTS.SOCIAL_PROVIDERS[keyof typeof AUTH_CONSTANTS.SOCIAL_PROVIDERS]