export const PROJECTS_CONSTANTS = {
    // Priority levels
    PRIORITY: {
        LOW: 'Low',
        MEDIUM: 'Medium',
        HIGH: 'High'
    } as const,

    // Project status
    STATUS: {
        ACTIVE: 'active',
        COMPLETED: 'completed',
        ON_HOLD: 'on-hold'
    } as const,

    // Task status
    TASK_STATUS: {
        TODO: 'TODO',
        IN_PROGRESS: 'IN_PROGRESS',
        DONE: 'DONE'
    } as const,

    // User roles in project
    ROLES: {
        OWNER: 'Owner',
        ADMIN: 'Admin',
        MEMBER: 'Member',
        VIEWER: 'Viewer'
    } as const,

    // Colors
    COLORS: [
        'bg-blue-500',
        'bg-green-500',
        'bg-purple-500',
        'bg-red-500',
        'bg-yellow-500',
        'bg-pink-500',
        'bg-indigo-500',
        'bg-orange-500',
        'bg-teal-500',
        'bg-cyan-500'
    ] as const,

    // Messages
    MESSAGES: {
        CREATE_SUCCESS: 'Project created successfully!',
        UPDATE_SUCCESS: 'Project updated successfully!',
        DELETE_SUCCESS: 'Project deleted successfully!',
        CREATE_FAILED: 'Failed to create project',
        UPDATE_FAILED: 'Failed to update project',
        DELETE_FAILED: 'Failed to delete project',
        FETCH_FAILED: 'Failed to fetch projects',
        SEARCH_FAILED: 'Failed to search projects',
        VALIDATION_ERROR: 'Validation Error',
        VALIDATION_GENERIC: 'Please check your input and try again.'
    },

    // Limits
    LIMITS: {
        MIN_NAME_LENGTH: 3,
        MAX_NAME_LENGTH: 100,
        MAX_DESCRIPTION_LENGTH: 1000,
        SEARCH_MIN_LENGTH: 3,
        SEARCH_DEBOUNCE_MS: 500
    },

    // Templates
    TEMPLATES: {
        EMPTY: 'empty',
        WEB_DEV: 'web-dev',
        MARKETING: 'marketing',
        PRODUCT_LAUNCH: 'product-launch',
        EVENT_PLANNING: 'event-planning'
    } as const
} as const

export type Priority = typeof PROJECTS_CONSTANTS.PRIORITY[keyof typeof PROJECTS_CONSTANTS.PRIORITY]
export type ProjectStatus = typeof PROJECTS_CONSTANTS.STATUS[keyof typeof PROJECTS_CONSTANTS.STATUS]
export type TaskStatus = typeof PROJECTS_CONSTANTS.TASK_STATUS[keyof typeof PROJECTS_CONSTANTS.TASK_STATUS]
export type ProjectRole = typeof PROJECTS_CONSTANTS.ROLES[keyof typeof PROJECTS_CONSTANTS.ROLES]
export type ProjectColor = typeof PROJECTS_CONSTANTS.COLORS[number]
export type TemplateType = typeof PROJECTS_CONSTANTS.TEMPLATES[keyof typeof PROJECTS_CONSTANTS.TEMPLATES]
