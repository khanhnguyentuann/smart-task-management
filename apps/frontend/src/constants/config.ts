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
    MOCK_PASSWORD: 'password123',
} as const;

export const PAGINATION_CONFIG = {
    DEFAULT_PAGE_SIZE: 20,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

export const FILE_CONFIG = {
    MAX_AVATAR_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_AVATAR_SIZE_MB: 5,
    SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
} as const;

export const VALIDATION_CONFIG = {
    PASSWORD_MIN_LENGTH: 6,
    PROJECT_NAME_MIN_LENGTH: 3,
    PROJECT_DESCRIPTION_MAX_LENGTH: 500,
    DESCRIPTION_TRUNCATE_LENGTH: 120,
} as const;

export const UI_CONFIG = {
    DEBOUNCE_DELAY: 500,
    TOAST_DURATION: 5000,
    API_SIMULATION_DELAY: 1000,
    ANIMATION_DURATION: 300,
} as const;

export const PROJECT_COLORS = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-indigo-500",
] as const;