/*
    Service layer: Contains business logic for tasks
    Call API, handle data transformation, caching...
*/
import { taskApi } from '../api'
import type { Task, CreateTaskPayload, UpdateTaskPayload } from '../types'

class TaskService {
    async getTasks(): Promise<Task[]> {
        const tasks = await taskApi.getTasks()
        return this.transformTasks(tasks)
    }

    async getTask(id: string): Promise<Task> {
        const task = await taskApi.getTask(id)
        return this.transformTask(task)
    }

    async createTask(payload: CreateTaskPayload): Promise<Task> {
        const task = await taskApi.createTask(payload)
        return this.transformTask(task)
    }

    async updateTask(id: string, payload: UpdateTaskPayload): Promise<Task> {
        const task = await taskApi.updateTask(id, payload)
        return this.transformTask(task)
    }

    async deleteTask(id: string): Promise<void> {
        await taskApi.deleteTask(id)
    }

    async getMyTasks(): Promise<Task[]> {
        const tasks = await taskApi.getMyTasks()
        return this.transformTasks(tasks)
    }

    async updateTaskStatus(id: string, status: string): Promise<Task> {
        const task = await taskApi.updateTaskStatus(id, status)
        return this.transformTask(task)
    }

    async assignTask(id: string, userId: string): Promise<Task> {
        const task = await taskApi.assignTask(id, userId)
        return this.transformTask(task)
    }

    async archiveTask(id: string): Promise<void> {
        await taskApi.archiveTask(id)
    }

    async restoreTask(id: string): Promise<void> {
        await taskApi.restoreTask(id)
    }

    // Transform backend data to frontend format
    private transformTask(task: any): Task {
        return {
            ...task,
            dueDate: task.dueDate ? new Date(task.dueDate) : null,
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt),
        }
    }

    private transformTasks(tasks: any[]): Task[] {
        return tasks.map(task => this.transformTask(task))
    }
}

export const taskService = new TaskService()
