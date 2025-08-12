import { useState, useEffect, useCallback } from "react"
import { useUser } from "@/features/layout"
import { DashboardService } from "../services/dashboard.service"
import { DashboardData, DashboardStats, Activity } from "../types/dashboard.types"

export const useDashboardData = () => {
    const { user: currentUser } = useUser()
    const [data, setData] = useState<DashboardData>({
        stats: {
            totalProjects: 0,
            activeTasks: 0,
            completedTasks: 0,
            overdueTasks: 0,
        },
        activities: [],
        loading: true
    })

    const fetchData = useCallback(async () => {
        if (!currentUser) return

        setData(prev => ({ ...prev, loading: true }))
        
        try {
            const dashboardData = await DashboardService.fetchDashboardData()
            setData(dashboardData)
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error)
            setData(prev => ({ ...prev, loading: false }))
        }
    }, [currentUser])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const refreshData = () => {
        fetchData()
    }

    return {
        stats: data.stats,
        activities: data.activities,
        loading: data.loading,
        refreshData
    }
}
