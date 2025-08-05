export interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  assignee: string
  assigneeAvatar: string
  project: string
  dueDate: string
  createdAt: string
  updatedAt: string
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