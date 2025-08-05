export interface DashboardStats {
  totalProjects: number
  activeTasks: number
  completedTasks: number
  overdueTasks: number
}

export interface RecentActivity {
  id: number
  type: "task_completed" | "project_created" | "task_assigned"
  user: string
  action: string
  target: string
  time: string
  avatar: string
}

export interface StatCard {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: string
  change: string
}

export interface DashboardContentProps {
  user: {
    name: string
    email: string
    role: "Admin" | "Member"
    avatar: string
  }
  onNavigate: (page: string) => void
} 