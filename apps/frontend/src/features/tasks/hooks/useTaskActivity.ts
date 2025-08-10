import { useCallback, useState, useEffect } from 'react'
import { activityService } from '../services'
import type { Activity } from '../types'

export function useTaskActivity(taskId: string) {
    const [activities, setActivities] = useState<Activity[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchActivities = useCallback(async () => {
        if (!taskId) return
        
        setLoading(true)
        setError(null)
        try {
            const data = await activityService.getTaskActivities(taskId)
            setActivities(data)
        } catch (err: any) {
            setError(err.message || 'Failed to load activities')
        } finally {
            setLoading(false)
        }
    }, [taskId])

    // Group activities by date for better UX
    const groupedActivities = activityService.groupActivitiesByDate(activities)

    // Get enriched activities with descriptions and icons
    const enrichedActivities = activities.map(activity => ({
        ...activity,
        description: activityService.getActivityDescription(activity),
        icon: activityService.getActivityIcon(activity.type)
    }))

    // Auto-fetch on mount or taskId change
    useEffect(() => {
        fetchActivities()
    }, [fetchActivities])

    return {
        activities,
        enrichedActivities,
        groupedActivities,
        loading,
        error,
        fetchActivities,
        refresh: fetchActivities
    }
}
