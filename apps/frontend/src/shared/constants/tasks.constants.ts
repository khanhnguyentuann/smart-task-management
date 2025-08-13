export const TASKS_CONSTANTS = {
    // Task status
    STATUS: {
        TODO: 'TODO',
        IN_PROGRESS: 'IN_PROGRESS',
        DONE: 'DONE'
    } as const,

    // Priority levels
    PRIORITY: {
        LOW: 'LOW',
        MEDIUM: 'MEDIUM',
        HIGH: 'HIGH'
    } as const,

    // Tab keys for task detail
    TAB_KEYS: {
        DETAILS: 'details',
        COMMENTS: 'comments',
        ACTIVITY: 'activity',
        FILES: 'files'
    } as const,

    // Limits
    LIMITS: {
        MIN_TITLE_LENGTH: 3,
        MAX_TITLE_LENGTH: 200,
        MAX_DESCRIPTION_LENGTH: 2000,
        MAX_COMMENT_LENGTH: 1000,
        MAX_ATTACHMENTS: 10,
        MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    },

    // Messages
    MESSAGES: {
        CREATE_SUCCESS: 'Task created successfully!',
        UPDATE_SUCCESS: 'Task updated successfully!',
        DELETE_SUCCESS: 'Task deleted successfully!',
        CREATE_FAILED: 'Failed to create task',
        UPDATE_FAILED: 'Failed to update task',
        DELETE_FAILED: 'Failed to delete task',
        FETCH_FAILED: 'Failed to fetch tasks',
        COMMENT_ADD_SUCCESS: 'Comment added successfully!',
        COMMENT_ADD_FAILED: 'Failed to add comment',
    }
} as const

export type TaskStatus = typeof TASKS_CONSTANTS.STATUS[keyof typeof TASKS_CONSTANTS.STATUS]
export type TaskPriority = typeof TASKS_CONSTANTS.PRIORITY[keyof typeof TASKS_CONSTANTS.PRIORITY]
export type TaskTabKey = typeof TASKS_CONSTANTS.TAB_KEYS[keyof typeof TASKS_CONSTANTS.TAB_KEYS]
