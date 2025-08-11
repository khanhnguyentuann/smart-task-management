// Token constants for consistent naming across the application
export const TOKEN_CONSTANTS = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
} as const

export type TokenType = typeof TOKEN_CONSTANTS[keyof typeof TOKEN_CONSTANTS]
