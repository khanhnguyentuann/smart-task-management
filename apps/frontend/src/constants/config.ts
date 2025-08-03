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
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
    DEFAULT_PAGE: 1,
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

export const DASHBOARD_CONFIG = {
    DEFAULT_TEAM_MEMBERS: 1,
    DEFAULT_COMPLETION_RATE: "0%",
    DEFAULT_ACTIVE_TASKS: 0,
    ANIMATION_DELAY: 0.1,
    ANIMATION_DURATION: 0.5,
} as const;

export const PROJECT_CONFIG = {
    MOCK_TASKS: {
        TODO: 8,
        IN_PROGRESS: 3,
        DONE: 12,
    },
    DEFAULT_MEMBERS: 1,
    PROGRESS_ANIMATION_DELAY: 0.3,
} as const;

export const FEATURES_CONFIG = {
    STATS: {
        ACTIVE_USERS: "50K+",
        UPTIME: "99.9%",
        SUPPORT: "24/7",
        COUNTRIES: "150+",
        HAPPY_USERS: "100K+",
        RATING: "4.9/5",
        PRODUCTIVITY_BOOST: "300%",
    },
    PRODUCTIVITY_BOOST_PERCENTAGE: "300%",
} as const;