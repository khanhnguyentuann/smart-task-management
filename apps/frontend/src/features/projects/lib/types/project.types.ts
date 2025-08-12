import { PROJECTS_CONSTANTS } from "../constants";
import type { BaseUser } from '@/shared/lib/types'

// BaseUser interface is now imported from shared types

// Task related interfaces
export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  assigneeId?: string;
  assignee?: Pick<BaseUser, 'id' | 'firstName' | 'lastName' | 'avatar' | 'email'>;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  todo: number;
  inProgress: number;
  done: number;
}

// Member related interfaces
export interface ProjectMember {
  user: BaseUser;
  joinedAt: string;
}

export interface TeamMember extends BaseUser {
  role: typeof PROJECTS_CONSTANTS.ROLES[keyof typeof PROJECTS_CONSTANTS.ROLES];
}

// Project core interfaces
export interface Project {
  id: string;
  name: string;
  description?: string;
  priority: 'Low' | 'Medium' | 'High';
  color: string;
  startDate?: string;
  endDate?: string;
  ownerId: string;
  owner: BaseUser;
  members: ProjectMember[];
  tasks: ProjectTask[];
  createdAt: string;
  updatedAt: string;
  // Frontend-specific computed fields
  userRole: 'Owner' | 'Member';
  memberCount: number;
  taskStats: TaskStats;
}

// Template related interfaces
export interface TemplateTask {
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: any;
  tasks: Array<{
    title: string;
    description: string;
    priority: typeof PROJECTS_CONSTANTS.PRIORITY[keyof typeof PROJECTS_CONSTANTS.PRIORITY];
  }>;
}

// Form data interfaces
export interface CreateProjectData {
  name: string;
  description: string;
  priority?: 'Low' | 'Medium' | 'High';
  color?: string;
  startDate?: string;
  endDate?: string;
  memberIds?: string[];
  templateTasks?: TemplateTask[];
}

export interface UpdateProjectData {
  name: string;
  description?: string;
  priority?: 'Low' | 'Medium' | 'High';
  color?: string;
  startDate?: string;
  endDate?: string;
}

// Component prop interfaces
export interface ProjectsListProps {
  user: BaseUser;
  onProjectSelect: (id: string) => void;
}

export interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateProjectData) => void;
}

export interface CreateProjectFormProps {
  onBack: () => void;
  onSave: (project: CreateProjectData) => void;
  currentUser: BaseUser;
}

export interface EditProjectFormProps {
  project: Project;
  onBack: () => void;
  onSave: (projectData: UpdateProjectData) => void;
  loading?: boolean;
}

export interface DeleteProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  projectName: string;
  loading?: boolean;
}

export interface ProjectUser {
  name: string;
  email: string;
  role: typeof PROJECTS_CONSTANTS.ROLES[keyof typeof PROJECTS_CONSTANTS.ROLES];
  avatar: string;
}

export interface ProjectDetailProps {
  projectId: string | null;
  user: ProjectUser;
  onBack: () => void;
}