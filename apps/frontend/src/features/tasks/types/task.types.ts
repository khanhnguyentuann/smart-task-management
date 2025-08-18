import { PROJECTS_CONSTANTS } from "@/features/projects"
import { User } from "@/shared/lib"

export interface TaskAssignee {
  id: string
  userId: string
  assignedAt: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    avatar?: string
  }
  assignedByUser: {
    id: string
    firstName: string
    lastName: string
  }
}

export interface Task {
  id: string
  title: string
  description?: string
  aiSummary: string
  priority: typeof PROJECTS_CONSTANTS.PRIORITY[keyof typeof PROJECTS_CONSTANTS.PRIORITY]
  assignees: TaskAssignee[]
  deadline?: string
  dueDate?: Date | null
  status: typeof PROJECTS_CONSTANTS.TASK_STATUS[keyof typeof PROJECTS_CONSTANTS.TASK_STATUS]
  project: string
  projectId?: string
  isArchived?: boolean
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
  formattedContent?: any // Rich text format
  taskId: string
  userId: string
  user: {
    id: string
    firstName: string
    lastName: string
    avatar?: string
  }

  // Threading
  parentId?: string
  threadId?: string
  replies?: Comment[]

  // Quote/Reply
  quotedCommentId?: string
  quotedComment?: Comment

  // Mentions
  mentions: string[]

  // Edit tracking
  isEdited: boolean
  editedAt?: Date

  // Reactions
  reactions?: CommentReaction[]

  // Attachments
  attachments?: CommentAttachment[]

  // Timestamps
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export interface CommentReaction {
  id: string
  commentId: string
  userId: string
  emoji: string // "👍", "❤️", "😮", etc.
  user: {
    id: string
    firstName: string
    lastName: string
    avatar?: string
  }
  createdAt: Date
}

export interface CommentAttachment {
  id: string
  commentId: string
  fileName: string
  fileUrl: string
  fileSize: number // in bytes
  mimeType: string
  uploadedBy: string
  createdAt: Date
}

export interface CreateCommentPayload {
  content: string
  mentions?: string[]
  parentId?: string
  quotedCommentId?: string
  attachments?: File[]
}

export interface UpdateCommentPayload {
  content: string
  mentions?: string[]
}

export interface AddCommentReactionPayload {
  commentId: string
  emoji: string
}

export interface RemoveCommentReactionPayload {
  commentId: string
  emoji: string
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
  fileName: string
  fileUrl: string
  fileSize: number // in bytes
  mimeType: string
  taskId: string
  uploadedBy: string
  createdAt: Date
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
  assignees: User[]
  dueDate: Date | null
  startDate?: Date | null
  createdAt: Date
  updatedAt: Date
  comments?: Comment[]
  activities?: Activity[]
  attachments?: FileAttachment[]
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
