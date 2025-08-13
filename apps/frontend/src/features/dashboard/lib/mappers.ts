import { CheckSquare, FolderKanban } from "lucide-react"
import { Activity, DashboardStats, StatCard } from "../types/dashboard.types"
import { DASHBOARD_CONSTANTS } from "@/shared/constants"
import { calculateProgress, getTrendDirection } from "./utils"

export const mapApiDataToStats = (projects: any[], tasks: any[]): DashboardStats => {
    const totalProjects = projects.length
    const activeTasks = tasks.filter((task: any) => task.status === 'IN_PROGRESS').length
    const completedTasks = tasks.filter((task: any) => task.status === 'DONE').length
    const overdueTasks = tasks.filter((task: any) => {
        if (!task.dueDate) return false
        return new Date(task.dueDate) < new Date() && task.status !== 'DONE'
    }).length

    return {
        totalProjects,
        activeTasks,
        completedTasks,
        overdueTasks,
    }
}

export const mapTasksToActivities = (tasks: any[]): Activity[] => {
    return tasks
        .filter((task: any) => task.status === 'DONE' && task.updatedAt)
        .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, DASHBOARD_CONSTANTS.ACTIVITY_LIMITS.recentTasks)
        .map((task: any) => ({
            id: `task-${task.id}`,
            type: "task_completed",
            user: task.assignee?.firstName ? `${task.assignee.firstName} ${task.assignee.lastName}` : "Team Member",
            action: "completed task",
            target: task.title,
            time: task.updatedAt,
            avatar: task.assignee?.avatar,
            status: "success",
            icon: CheckSquare,
        }))
}

export const mapProjectsToActivities = (projects: any[]): Activity[] => {
    return projects
        .filter((project: any) => project.createdAt)
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, DASHBOARD_CONSTANTS.ACTIVITY_LIMITS.recentProjects)
        .map((project: any) => ({
            id: `project-${project.id}`,
            type: "project_created",
            user: project.owner?.firstName ? `${project.owner.firstName} ${project.owner.lastName}` : "Team Member",
            action: "created project",
            target: project.name,
            time: project.createdAt,
            avatar: project.owner?.avatar,
            status: "info",
            icon: FolderKanban,
        }))
}

export const mapStatsToStatCards = (stats: DashboardStats): StatCard[] => {
    return [
        {
            title: "Total Projects",
            value: stats.totalProjects,
            icon: FolderKanban,
            color: "from-blue-500 to-blue-600",
            iconColor: "text-blue-600",
            change: stats.totalProjects > 0 ? `${stats.totalProjects} active projects` : "No projects yet",
            progress: calculateProgress(stats.totalProjects, DASHBOARD_CONSTANTS.PROGRESS_TARGETS.projects),
            trend: getTrendDirection(stats.totalProjects),
        },
        {
            title: "Active Tasks",
            value: stats.activeTasks,
            icon: CheckSquare,
            color: "from-green-500 to-green-600",
            iconColor: "text-green-600",
            change: stats.activeTasks > 0 ? `${stats.activeTasks} in progress` : "No active tasks",
            progress: calculateProgress(stats.activeTasks, DASHBOARD_CONSTANTS.PROGRESS_TARGETS.activeTasks),
            trend: getTrendDirection(stats.activeTasks),
        },
        {
            title: "Completed Tasks",
            value: stats.completedTasks,
            icon: CheckSquare,
            color: "from-purple-500 to-purple-600",
            iconColor: "text-purple-600",
            change: stats.completedTasks > 0 ? `${stats.completedTasks} completed` : "No completed tasks",
            progress: calculateProgress(stats.completedTasks, DASHBOARD_CONSTANTS.PROGRESS_TARGETS.completedTasks),
            trend: getTrendDirection(stats.completedTasks),
        },
        {
            title: "Overdue Tasks",
            value: stats.overdueTasks,
            icon: CheckSquare,
            color: "from-red-500 to-red-600",
            iconColor: "text-red-600",
            change: stats.overdueTasks > 0 ? "Needs attention" : "All tasks on time",
            progress: calculateProgress(stats.overdueTasks, DASHBOARD_CONSTANTS.PROGRESS_TARGETS.overdueTasks),
            trend: stats.overdueTasks > 0 ? "down" : "up",
        },
    ]
}
