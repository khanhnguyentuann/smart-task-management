/*
    Service layer: Contains business logic for subtasks
*/
import { subtaskApi } from '../api'
import type { Subtask, CreateSubtaskPayload, UpdateSubtaskPayload } from '../types'

class SubtaskService {
    async getTaskSubtasks(taskId: string): Promise<Subtask[]> {
        const subtasks = await subtaskApi.getTaskSubtasks(taskId)
        return this.transformSubtasks(subtasks)
    }

    async addSubtask(taskId: string, title: string): Promise<Subtask> {
        const payload: CreateSubtaskPayload = { title }
        const subtask = await subtaskApi.addSubtask(taskId, payload)
        return this.transformSubtask(subtask)
    }

    async updateSubtask(taskId: string, subtaskId: string, title: string): Promise<Subtask> {
        const payload: UpdateSubtaskPayload = { title }
        const subtask = await subtaskApi.updateSubtask(taskId, subtaskId, payload)
        return this.transformSubtask(subtask)
    }

    async deleteSubtask(taskId: string, subtaskId: string): Promise<void> {
        await subtaskApi.deleteSubtask(taskId, subtaskId)
    }

    async toggleSubtask(taskId: string, subtaskId: string): Promise<Subtask> {
        const subtask = await subtaskApi.toggleSubtask(taskId, subtaskId)
        return this.transformSubtask(subtask)
    }

    // Calculate progress
    getProgress(subtasks: Subtask[]): { completed: number; total: number; percentage: number } {
        const total = subtasks.length
        const completed = subtasks.filter(st => st.completed).length
        const percentage = total > 0 ? (completed / total) * 100 : 0
        
        return { completed, total, percentage }
    }

    // Transform backend data to frontend format
    private transformSubtask(subtask: any): Subtask {
        return {
            ...subtask,
            createdAt: new Date(subtask.createdAt),
            updatedAt: subtask.updatedAt ? new Date(subtask.updatedAt) : undefined,
        }
    }

    private transformSubtasks(subtasks: any[]): Subtask[] {
        return subtasks.map(subtask => this.transformSubtask(subtask))
    }
}

export const subtaskService = new SubtaskService()
