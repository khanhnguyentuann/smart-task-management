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
        ASSIGNEE_ADD_SUCCESS: 'Assignee added successfully!',
        ASSIGNEE_ADD_FAILED: 'Failed to add assignee',
        ASSIGNEE_REMOVE_SUCCESS: 'Assignee removed successfully!',
        ASSIGNEE_REMOVE_FAILED: 'Failed to remove assignee',
        ASSIGNEE_UPDATE_SUCCESS: 'Assignees updated successfully!',
        ASSIGNEE_UPDATE_FAILED: 'Failed to update assignees',
        LABEL_CREATE_SUCCESS: 'Label created successfully!',
        LABEL_CREATE_FAILED: 'Failed to create label',
        LABEL_UPDATE_SUCCESS: 'Label updated successfully!',
        LABEL_UPDATE_FAILED: 'Failed to update label',
        LABEL_DELETE_SUCCESS: 'Label deleted successfully!',
        LABEL_DELETE_FAILED: 'Failed to delete label',
    },

    // Query keys for React Query
    QUERY_KEYS: {
        TASK_ASSIGNEES: (taskId: string) => ['task-assignees', taskId],
        PROJECT_MEMBERS: (taskId: string) => ['project-members', taskId],
        TASK_LABELS: (taskId: string) => ['task-labels', taskId],
        TASKS: ['tasks'],
        PROJECTS: ['projects'],
    },

    // Cache times for React Query
    CACHE_TIMES: {
        STALE_TIME: 1000 * 60 * 5, // 5 minutes
        RETRY_COUNT: 1,
    },
} as const

export type TaskStatus = typeof TASKS_CONSTANTS.STATUS[keyof typeof TASKS_CONSTANTS.STATUS]
export type TaskPriority = typeof TASKS_CONSTANTS.PRIORITY[keyof typeof TASKS_CONSTANTS.PRIORITY]
export type TaskTabKey = typeof TASKS_CONSTANTS.TAB_KEYS[keyof typeof TASKS_CONSTANTS.TAB_KEYS]
