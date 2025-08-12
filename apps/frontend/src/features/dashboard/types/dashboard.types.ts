import type { User } from '@/shared/lib/types'

// User interface is now imported from shared types

export interface DashboardContentProps {
    user: User | null
    onNavigate: (page: string) => void
}

export interface DashboardStats {
    totalProjects: number
    activeTasks: number
    completedTasks: number
    overdueTasks: number
}

export interface Activity {
    id: string
    type: string
    user: string
    action: string
    target: string
    time: string
    avatar?: string
    status: string
    icon: any
}

export interface StatCard {
    title: string
    value: number
    icon: any
    color: string
    iconColor: string
    change: string
    progress: number
    trend: "up" | "down" | "neutral"
}

export interface DashboardData {
    stats: DashboardStats
    activities: Activity[]
    loading: boolean
} 