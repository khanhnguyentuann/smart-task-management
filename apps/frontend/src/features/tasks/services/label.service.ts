/*
    Service layer: Contains business logic for task labels
    Call API, handle data transformation, caching...
*/
import { labelApi, TaskLabel, CreateLabelRequest, UpdateLabelRequest } from '../api/label.api'

class LabelService {
    async getTaskLabels(taskId: string): Promise<TaskLabel[]> {
        try {
            const response = await labelApi.getTaskLabels(taskId)
            return Array.isArray(response) ? response : []
        } catch (error) {
            console.error('❌ Service: Error fetching task labels:', error)
            return []
        }
    }

    async createTaskLabel(taskId: string, data: CreateLabelRequest): Promise<TaskLabel> {
        try {
            const response = await labelApi.createTaskLabel(taskId, data)
            return response
        } catch (error) {
            console.error('❌ Service: Error creating task label:', error)
            throw error
        }
    }

    async updateTaskLabel(taskId: string, labelId: string, data: UpdateLabelRequest): Promise<TaskLabel> {
        try {
            const response = await labelApi.updateTaskLabel(taskId, labelId, data)
            return response
        } catch (error) {
            console.error('❌ Service: Error updating task label:', error)
            throw error
        }
    }

    async deleteTaskLabel(taskId: string, labelId: string): Promise<{ message: string }> {
        try {
            const response = await labelApi.deleteTaskLabel(taskId, labelId)
            return response
        } catch (error) {
            console.error('❌ Service: Error deleting task label:', error)
            throw error
        }
    }

    // Business logic: Validate label data
    validateLabelData(name: string, color: string): boolean {
        return name.trim().length > 0 && color.trim().length > 0
    }

    // Business logic: Generate random color if not provided
    generateRandomColor(): string {
        const colors = [
            'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
            'bg-red-500', 'bg-yellow-500', 'bg-pink-500',
            'bg-indigo-500', 'bg-teal-500', 'bg-orange-500'
        ]
        return colors[Math.floor(Math.random() * colors.length)]
    }
}

export const labelService = new LabelService()
