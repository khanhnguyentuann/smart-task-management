export const DASHBOARD_CONSTANTS = {
    STATUS_COLORS: {
        success: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
        warning: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
        info: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
        default: "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400"
    },
    
    GREETING_MESSAGES: {
        morning: "Good morning",
        afternoon: "Good afternoon", 
        evening: "Good evening"
    },
    
    EMOJIS: {
        morning: "🌅",
        afternoon: "☀️",
        evening: "🌙"
    },
    
    TIME_THRESHOLDS: {
        morning: 12,
        afternoon: 17
    },
    
    ACTIVITY_LIMITS: {
        recentTasks: 2,
        recentProjects: 2,
        maxActivities: 4
    },
    
    PROGRESS_TARGETS: {
        projects: 10,
        activeTasks: 20,
        completedTasks: 50,
        overdueTasks: 5
    }
} as const
