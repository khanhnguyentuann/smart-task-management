/*
    Service layer: Contains business logic for labels
*/
import { labelApi } from '../api'
import type { Label, CreateLabelPayload, UpdateLabelPayload } from '../types'

class LabelService {
    async getTaskLabels(taskId: string): Promise<Label[]> {
        return labelApi.getTaskLabels(taskId)
    }

    async addLabel(taskId: string, name: string, color?: string): Promise<Label> {
        const payload: CreateLabelPayload = { 
            name, 
            color: color || this.getRandomColor() 
        }
        return labelApi.addLabel(taskId, payload)
    }

    async removeLabel(taskId: string, labelId: string): Promise<void> {
        await labelApi.removeLabel(taskId, labelId)
    }

    async updateLabel(labelId: string, name: string, color: string): Promise<Label> {
        const payload: UpdateLabelPayload = { name, color }
        return labelApi.updateLabel(labelId, payload)
    }

    async getProjectLabels(projectId: string): Promise<Label[]> {
        return labelApi.getProjectLabels(projectId)
    }

    async createProjectLabel(projectId: string, name: string, color?: string): Promise<Label> {
        const payload: CreateLabelPayload = { 
            name, 
            color: color || this.getRandomColor() 
        }
        return labelApi.createProjectLabel(projectId, payload)
    }

    // Utility: Get random color for new labels
    private getRandomColor(): string {
        const colors = [
            'bg-blue-500',
            'bg-green-500', 
            'bg-purple-500',
            'bg-red-500',
            'bg-yellow-500',
            'bg-pink-500',
            'bg-indigo-500',
            'bg-orange-500'
        ]
        return colors[Math.floor(Math.random() * colors.length)]
    }

    // Utility: Check if color is valid
    isValidColor(color: string): boolean {
        return color.startsWith('bg-') && color.includes('-')
    }
}

export const labelService = new LabelService()
