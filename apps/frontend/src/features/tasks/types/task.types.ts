import { PROJECTS_CONSTANTS } from "@/features/projects"

export interface Task {
  id: string
  title: string
  description?: string
  aiSummary: string
  priority: typeof PROJECTS_CONSTANTS.PRIORITY[keyof typeof PROJECTS_CONSTANTS.PRIORITY]
  assignee: {
    id?: string
    name: string
    avatar: string
    email?: string
  }
  deadline?: string
  dueDate?: Date | null
  status: typeof PROJECTS_CONSTANTS.TASK_STATUS[keyof typeof PROJECTS_CONSTANTS.TASK_STATUS]
  project: string
  projectId?: string
  createdAt: Date
  updatedAt: Date
}

// Extended types for API layer
export interface CreateTaskPayload {
  title: string
  description?: string
  priority: string
  status?: string
  projectId: string
  assigneeId?: string
  dueDate?: string
}

export interface UpdateTaskPayload {
  title?: string
  description?: string
  priority?: string
  status?: string
  dueDate?: string | null
}

// Comment types
export interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar: string
  }
  createdAt: Date
  updatedAt?: Date
  mentions?: string[]
  likes?: number
  isLiked?: boolean
}

export interface CreateCommentPayload {
  content: string
  mentions?: string[]
}

export interface UpdateCommentPayload {
  content: string
}

// Subtask types
export interface Subtask {
  id: string
  title: string
  completed: boolean
  createdAt: Date
  updatedAt?: Date
}

export interface CreateSubtaskPayload {
  title: string
}

export interface UpdateSubtaskPayload {
  title?: string
  completed?: boolean
}

// Label types
export interface Label {
  id: string
  name: string
  color: string
}

export interface CreateLabelPayload {
  name: string
  color: string
}

export interface UpdateLabelPayload {
  name?: string
  color?: string
}

// File attachment types
export interface FileAttachment {
  id: string
  name: string
  size: string
  type?: string
  url?: string
  uploadedBy: string
  uploadedAt: Date
}

export interface UploadFileResponse {
  fileId: string
  url: string
  message: string
}

// Activity types
export interface Activity {
  id: string
  type: string
  description: string
  user: {
    id: string
    name: string
    avatar: string
  }
  timestamp: Date
}

export interface TaskFilters {
  status?: "todo" | "in-progress" | "completed"
  priority?: "low" | "medium" | "high"
  assignee?: string
  project?: string
}

export interface CreateTaskData {
  title: string
  description: string
  priority: "low" | "medium" | "high"
  assignee: string
  project: string
  dueDate: string
}

export interface MyTasksProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onCreateTask: () => void
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
}

export interface TaskCardProps {
  task: Task
  onClick: (task: Task) => void
  onStatusChange: (taskId: string, status: Task["status"]) => void
}

export interface CreateTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateTaskData) => void
  projects: Array<{ id: string; name: string }>
  members: Array<{ id: string; name: string }>
}

export interface TaskFiltersProps {
  filters: TaskFilters
  onFiltersChange: (filters: TaskFilters) => void
  projects: Array<{ id: string; name: string }>
  members: Array<{ id: string; name: string }>
}

export interface TaskDetail {
  id: string
  title: string
  description: string
  status: "TODO" | "IN_PROGRESS" | "DONE"
  priority: "LOW" | "MEDIUM" | "HIGH"
  assignees: Array<{
    id: string
    name: string
    avatar: string
    email: string
  }>
  dueDate: Date | null
  labels: Array<{
    id: string
    name: string
    color: string
  }>
  subtasks: Array<{
    id: string
    title: string
    completed: boolean
  }>
  attachments: Array<{
    id: string
    name: string
    size: string
    type: string
    url: string
    uploadedBy: string
    uploadedAt: Date
  }>
  comments: Array<{
    id: string
    content: string
    author: {
      id: string
      name: string
      avatar: string
    }
    createdAt: Date
    mentions: string[]
  }>
  activities: Array<{
    id: string
    type: string
    description: string
    user: {
      id: string
      name: string
      avatar: string
    }
    timestamp: Date
  }>
  createdAt: Date
  updatedAt: Date
}

export interface TaskDetailModalProps {
  task: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (task: any) => void
  onDelete?: (taskId: string) => void
  teamMembers?: Array<{
    id: string
    name: string
    avatar: string
    email: string
  }>
  currentUser?: {
    id: string
    name: string
    avatar: string
  }
}

export interface AnimatedTaskCardProps {
  task: Task
  className?: string
  onClick?: () => void
}