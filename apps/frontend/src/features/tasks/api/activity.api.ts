/*
    API layer: Activity logs for tasks
*/
import { apiClient } from '@/core/services/api-client'
import type { Activity } from '../types'

class ActivityApi {
    async getTaskActivities(taskId: string): Promise<Activity[]> {
        return apiClient.get<Activity[]>(`/tasks/${taskId}/activities`)
    }

    async getUserActivities(userId?: string): Promise<Activity[]> {
        const endpoint = userId ? `/users/${userId}/activities` : '/users/me/activities'
        return apiClient.get<Activity[]>(endpoint)
    }

    async getProjectActivities(projectId: string): Promise<Activity[]> {
        return apiClient.get<Activity[]>(`/projects/${projectId}/activities`)
    }
}

export const activityApi = new ActivityApi()
