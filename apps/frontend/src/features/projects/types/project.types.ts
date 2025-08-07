export interface Project {
  id: string
  name: string
  description?: string
  priority: 'Low' | 'Medium' | 'High'
  color: string
  startDate?: string
  endDate?: string
  ownerId: string
  owner: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  members: ProjectMember[]
  tasks: ProjectTask[]
  createdAt: string
  updatedAt: string
  // Frontend-specific fields
  userRole: 'Owner' | 'Member'
  memberCount: number
  taskStats: {
    todo: number
    inProgress: number
    done: number
  }
}

export interface ProjectMember {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  joinedAt: string
}

export interface ProjectTask {
  id: string
  title: string
  description: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  assigneeId?: string
  assignee?: {
    id: string
    firstName: string
    lastName: string
  }
  createdAt: string
  updatedAt: string
}

export interface CreateProjectData {
  name: string
  description: string
  priority?: 'Low' | 'Medium' | 'High'
  color?: string
  startDate?: string
  endDate?: string
  memberIds?: string[]
  templateTasks?: Array<{
    title: string
    description: string
    priority: 'Low' | 'Medium' | 'High'
  }>
}

export interface UpdateProjectData {
  name: string
  description?: string
  priority?: 'Low' | 'Medium' | 'High'
  color?: string
  startDate?: string
  endDate?: string
}

export interface ProjectsListProps {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  onProjectSelect: (id: string) => void
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