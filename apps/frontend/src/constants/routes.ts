export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    PROJECTS: '/projects',
    PROJECT_DETAIL: (id: string) => `/projects/${id}`,
    TASKS: '/tasks',
    TEAM: '/team',
    CALENDAR: '/calendar',
    REPORTS: '/reports',
    PROFILE: '/profile',
    SETTINGS: '/settings',
} as const;

export const PUBLIC_ROUTES = [
    ROUTES.HOME,
    ROUTES.LOGIN,
    ROUTES.REGISTER,
] as const;

export const PROTECTED_ROUTES = [
    ROUTES.DASHBOARD,
    ROUTES.PROJECTS,
    ROUTES.TASKS,
    ROUTES.TEAM,
    ROUTES.CALENDAR,
    ROUTES.REPORTS,
    ROUTES.PROFILE,
    ROUTES.SETTINGS,
] as const;