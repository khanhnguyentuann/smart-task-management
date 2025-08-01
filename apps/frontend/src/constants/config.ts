export const APP_CONFIG = {
    NAME: 'Smart Task Management',
    SHORT_NAME: 'Smart Task',
    DESCRIPTION: 'AI-powered task management system',
    VERSION: '0.1.0',
} as const;

export const THEME_CONFIG = {
    DEFAULT_THEME: 'system',
    STORAGE_KEY: 'smart-task-theme',
} as const;

export const AUTH_CONFIG = {
    TOKEN_KEY: 'accessToken',
    REFRESH_TOKEN_KEY: 'refreshToken',
    USER_KEY: 'user',
} as const;

export const PAGINATION_CONFIG = {
    DEFAULT_PAGE_SIZE: 20,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;