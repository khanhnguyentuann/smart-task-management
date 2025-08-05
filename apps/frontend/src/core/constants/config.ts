export const APP_CONFIG = {
  NAME: "Smart Task Management",
  VERSION: "1.0.0",
  DESCRIPTION: "A modern task management application",
} as const

export const THEME_CONFIG = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const

export const TASK_PRIORITIES = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const

export const TASK_STATUSES = {
  TODO: "todo",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
} as const

export const PROJECT_STATUSES = {
  ACTIVE: "active",
  COMPLETED: "completed",
  ON_HOLD: "on-hold",
} as const

export const USER_ROLES = {
  ADMIN: "Admin",
  MEMBER: "Member",
} as const

export const PROJECT_ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  MEMBER: "member",
} as const 