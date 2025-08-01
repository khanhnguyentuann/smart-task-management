export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        ME: '/auth/me',
    },
    PROJECTS: {
        BASE: '/projects',
        BY_ID: (id: string) => `/projects/${id}`,
        SEARCH: '/projects/search',
        MEMBERS: (id: string) => `/projects/${id}/members`,
        MEMBER: (projectId: string, userId: string) => `/projects/${projectId}/members/${userId}`,
    },
    TASKS: {
        BASE: '/tasks',
        BY_ID: (id: string) => `/tasks/${id}`,
        BY_PROJECT: (projectId: string) => `/tasks?projectId=${projectId}`,
    },
} as const;

export const API_CONFIG = {
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
} as const;