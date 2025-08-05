export interface Project {
  id: string
  name: string
  description: string
  status: "active" | "completed" | "on-hold"
  progress: number
  dueDate: string
  members: ProjectMember[]
  tasks: ProjectTask[]
  createdAt: string
  updatedAt: string
}

export interface ProjectMember {
  id: string
  name: string
  email: string
  role: "owner" | "admin" | "member"
  avatar: string
}

export interface ProjectTask {
  id: string
  title: string
  status: "todo" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  assignee: string
  dueDate: string
}

export interface CreateProjectData {
  name: string
  description: string
  dueDate: string
  members: string[]
}

export interface ProjectsListProps {
  projects: Project[]
  onProjectClick: (project: Project) => void
  onCreateProject: () => void
}

export interface ProjectDetailProps {
  project: Project
  onBack: () => void
  onEdit: (project: Project) => void
}

export interface CreateProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateProjectData) => void
} 