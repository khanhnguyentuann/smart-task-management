/*
    Service layer: Contains business logic for tasks
    Call API, handle data transformation, caching...
*/
import { taskApi } from '../api'
import type { Task, CreateTaskPayload, UpdateTaskPayload } from '../types'

class TaskService {
    // ==========================================
    // TASK CRUD OPERATIONS
    // ==========================================
    
    async getTasks(): Promise<Task[]> {
        const tasks = await taskApi.getAllTasks()
        return this.transformTasks(tasks)
    }

    async getTask(id: string): Promise<Task> {
        const task = await taskApi.getTaskById(id)
        return this.transformTask(task)
    }

    async createTask(payload: CreateTaskPayload): Promise<Task> {
        const task = await taskApi.createNewTask(payload)
        return this.transformTask(task)
    }

    async updateTask(id: string, payload: UpdateTaskPayload): Promise<Task> {
        const task = await taskApi.updateTaskById(id, payload)
        return this.transformTask(task)
    }

    async deleteTask(id: string): Promise<void> {
        await taskApi.deleteTaskById(id)
    }

    // ==========================================
    // USER TASKS
    // ==========================================
    
    async getMyTasks(): Promise<Task[]> {
        const tasks = await taskApi.getMyAssignedTasks()
        return this.transformTasks(tasks)
    }

    // ==========================================
    // TASK ACTIONS
    // ==========================================
    
    async updateTaskStatus(id: string, status: string): Promise<Task> {
        const task = await taskApi.updateTaskStatusById(id, status)
        return this.transformTask(task)
    }



    async archiveTask(id: string): Promise<void> {
        await taskApi.archiveTaskById(id)
    }

    async restoreTask(id: string): Promise<void> {
        await taskApi.restoreTaskById(id)
    }

    // ==========================================
    // TASK RELATIONS
    // ==========================================
    
    async getTaskLabels(taskId: string): Promise<any[]> {
        const labels = await taskApi.getTaskLabelsById(taskId)
        return labels
    }

    async getTaskSubtasks(taskId: string): Promise<any[]> {
        const subtasks = await taskApi.getTaskSubtasksById(taskId)
        return subtasks
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
