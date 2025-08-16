export const TASKBOT_CONSTANTS = {
    ANIMATION: {
        DELAY: 1000,
        DURATION: 3000,
        SPRING_STIFFNESS: 300,
    },
    POSITION: {
        MOBILE: {
            BOTTOM: 'bottom-4',
            RIGHT: 'right-4',
        },
        DESKTOP: {
            BOTTOM: 'sm:bottom-6',
            RIGHT: 'sm:right-6',
        },
    },
    MOODS: {
        HAPPY: '😊',
        WORKING: '🤖',
        THINKING: '🤔',
        SLEEPING: '😴',
    },
    ACTIONS: {
        CREATE_TASK: 'create-task',
        CREATE_PROJECT: 'create-project',
        SEARCH: 'search',
        HELP: 'help',
        SETTINGS: 'settings',
    },
} as const
