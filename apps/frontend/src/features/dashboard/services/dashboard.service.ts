import { dashboardApi } from "../api/dashboard.api"
import { mapApiDataToStats, mapTasksToActivities, mapProjectsToActivities, mapStatsToStatCards } from "../lib/mappers"
import { formatTimeAgo } from "../lib/utils"
import { Activity, DashboardData, DashboardStats } from "../types/dashboard.types"

export class DashboardService {
    static async fetchDashboardData(): Promise<DashboardData> {
        try {
            const { projects, tasks } = await dashboardApi.getDashboardData()
            
            // Calculate stats
            const stats = mapApiDataToStats(projects, tasks)
            
            // Generate activities
            const taskActivities = mapTasksToActivities(tasks)
            const projectActivities = mapProjectsToActivities(projects)
            
            // Combine and sort activities
            const allActivities = [...taskActivities, ...projectActivities]
                .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
                .slice(0, 4)
                .map(activity => ({
                    ...activity,
                    time: formatTimeAgo(activity.time)
                }))

            return {
                stats,
                activities: allActivities,
                loading: false
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error)
            
            // Return empty data on error
            return {
                stats: {
                    totalProjects: 0,
                    activeTasks: 0,
                    completedTasks: 0,
                    overdueTasks: 0,
                },
                activities: [],
                loading: false
            }
        }
    }

    static getStatCards(stats: DashboardStats) {
        return mapStatsToStatCards(stats)
    }
}
