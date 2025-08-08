export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  PROJECTS: "/projects",
  TASKS: "/tasks",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  NOTIFICATIONS: "/notifications",
  HELP: "/help",
} as const

export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
  },
  PROJECTS: {
    LIST: "/api/projects",
    CREATE: "/api/projects",
    SEARCH: "/api/projects/search",
    DETAIL: (id: string) => `/api/projects/${id}`,
    UPDATE: (id: string) => `/api/projects/${id}`,
    DELETE: (id: string) => `/api/projects/${id}`,
    TASKS: (projectId: string) => `/api/projects/${projectId}/tasks`,
  },
  TASKS: {
    LIST: "/api/tasks",
    CREATE: "/api/tasks",
    DETAIL: (id: string) => `/api/tasks/${id}`,
    UPDATE: (id: string) => `/api/tasks/${id}`,
    DELETE: (id: string) => `/api/tasks/${id}`,
  },
  USERS: {
    LIST: "/api/users",
    PROFILE: "/api/users/profile",
    UPDATE: "/api/users/profile",
    DETAIL: (id: string) => `/api/users/${id}`,
  },
} as const 