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
    MEMBERS: {
      ADD: (projectId: string) => `/api/projects/${projectId}/members`,
      REMOVE: (projectId: string, memberId: string) => `/api/projects/${projectId}/members/${memberId}`,
    },
  },
  TASKS: {
    LIST: "/api/users/me/tasks",
    CREATE: "/api/tasks",
    DETAIL: (id: string) => `/api/tasks/${id}`,
    UPDATE: (id: string) => `/api/tasks/${id}`,
    DELETE: (id: string) => `/api/tasks/${id}`,
  },
  USERS: {
    LIST: "/api/users",
    PROFILE: "/api/users/profile",
    UPDATE: "/api/users/profile",
    AVATAR: "/api/users/avatar",
    AVATAR_OF: (userId: string) => `/api/users/avatar/${userId}`,
    DETAIL: (id: string) => `/api/users/${id}`,
  },
} as const 