/**
 * Service layer: Contains business logic for task subtasks
 * - Error handling
 * - Data transformation
 * - Business rules
 */

import { subtaskApi, TaskSubtask, CreateSubtaskRequest, UpdateSubtaskRequest } from '../api/subtask.api'

class SubtaskService {
    async getTaskSubtasks(taskId: string): Promise<TaskSubtask[]> {
        try {
            const response = await subtaskApi.getTaskSubtasks(taskId)
            return Array.isArray(response) ? response : []
        } catch (error) {
            console.error('❌ Service: Error fetching task subtasks:', error)
            return []
        }
    }

    async createSubtask(taskId: string, data: CreateSubtaskRequest): Promise<TaskSubtask> {
        try {
            const response = await subtaskApi.createSubtask(taskId, data)
            return response
        } catch (error) {
            console.error('❌ Service: Error creating subtask:', error)
            throw error
        }
    }

    async updateSubtask(taskId: string, subtaskId: string, data: UpdateSubtaskRequest): Promise<TaskSubtask> {
        try {
            const response = await subtaskApi.updateSubtask(taskId, subtaskId, data)
            return response
        } catch (error) {
            console.error('❌ Service: Error updating subtask:', error)
            throw error
        }
    }

    async deleteSubtask(taskId: string, subtaskId: string): Promise<{ message: string }> {
        try {
            const response = await subtaskApi.deleteSubtask(taskId, subtaskId)
            return response
        } catch (error) {
            console.error('❌ Service: Error deleting subtask:', error)
            throw error
        }
    }

    validateSubtaskData(title: string, description?: string): boolean {
        return title.trim().length > 0 && title.trim().length <= 200
    }

    getSubtaskProgress(subtasks: TaskSubtask[]): { completed: number; total: number; percentage: number } {
        const total = subtasks.length
        const completed = subtasks.filter(subtask => subtask.status === 'DONE').length
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

        return { completed, total, percentage }
    }

    getSubtaskStatusColor(status: string): string {
        switch (status) {
            case 'TODO':
                return 'bg-gray-500'
            case 'IN_PROGRESS':
                return 'bg-blue-500'
            case 'DONE':
                return 'bg-green-500'
            default:
                return 'bg-gray-500'
        }
    }

    getSubtaskPriorityColor(priority: string): string {
        switch (priority) {
            case 'LOW':
                return 'bg-green-500'
            case 'MEDIUM':
                return 'bg-yellow-500'
            case 'HIGH':
                return 'bg-red-500'
            default:
                return 'bg-gray-500'
        }
    }
}

export const subtaskService = new SubtaskService()
