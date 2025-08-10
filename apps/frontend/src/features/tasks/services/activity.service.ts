/*
    Service layer: Contains business logic for activity tracking
*/
import { activityApi } from '../api'
import type { Activity } from '../types'

class ActivityService {
    async getTaskActivities(taskId: string): Promise<Activity[]> {
        const activities = await activityApi.getTaskActivities(taskId)
        return this.transformActivities(activities)
    }

    async getUserActivities(userId?: string): Promise<Activity[]> {
        const activities = await activityApi.getUserActivities(userId)
        return this.transformActivities(activities)
    }

    async getProjectActivities(projectId: string): Promise<Activity[]> {
        const activities = await activityApi.getProjectActivities(projectId)
        return this.transformActivities(activities)
    }

    // Group activities by date
    groupActivitiesByDate(activities: Activity[]): Record<string, Activity[]> {
        const grouped: Record<string, Activity[]> = {}
        
        activities.forEach(activity => {
            const dateKey = activity.timestamp.toDateString()
            if (!grouped[dateKey]) {
                grouped[dateKey] = []
            }
            grouped[dateKey].push(activity)
        })
        
        return grouped
    }

    // Get activity description based on type
    getActivityDescription(activity: Activity): string {
        switch (activity.type) {
            case 'status_change':
                return 'moved this task from To Do to In Progress'
            case 'comment':
                return 'added a comment'
            case 'assignment':
                return 'assigned this task'
            case 'priority_change':
                return 'changed priority'
            case 'due_date_change':
                return 'updated due date'
            case 'label_added':
                return 'added a label'
            case 'label_removed':
                return 'removed a label'
            case 'file_uploaded':
                return 'uploaded a file'
            case 'subtask_added':
                return 'added a subtask'
            case 'subtask_completed':
                return 'completed a subtask'
            default:
                return activity.description || 'made changes'
        }
    }

    // Get activity icon
    getActivityIcon(type: string): string {
        switch (type) {
            case 'status_change':
                return '🔄'
            case 'comment':
                return '💬'
            case 'assignment':
                return '👤'
            case 'priority_change':
                return '⚡'
            case 'due_date_change':
                return '📅'
            case 'label_added':
            case 'label_removed':
                return '🏷️'
            case 'file_uploaded':
                return '📎'
            case 'subtask_added':
            case 'subtask_completed':
                return '☑️'
            default:
                return '📝'
        }
    }

    // Transform backend data to frontend format
    private transformActivities(activities: any[]): Activity[] {
        return activities
            .map(activity => ({
                ...activity,
                timestamp: new Date(activity.timestamp || activity.createdAt)
            }))
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()) // Latest first
    }
}

export const activityService = new ActivityService()
