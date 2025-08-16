import { useCallback, useState, useEffect } from 'react'
import { taskService } from '../services'
import type { Task, UpdateTaskPayload } from '../types'

export function useTaskDetail(taskId: string) {
    const [task, setTask] = useState<Task | null>(null)
    const [labels, setLabels] = useState<any[]>([])
    const [subtasks, setSubtasks] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchTask = useCallback(async () => {
        if (!taskId) return
        setLoading(true)
        setError(null)
        try {
            const [taskData, labelsData, subtasksData] = await Promise.all([
                taskService.getTask(taskId),
                taskService.getTaskLabels(taskId),
                taskService.getTaskSubtasks(taskId)
            ])


            setTask(taskData)
            setLabels(labelsData)
            setSubtasks(subtasksData)
        } catch (err: any) {
            setError(err.message || 'Failed to load task')
        } finally {
            setLoading(false)
        }
    }, [taskId])

    const updateTask = useCallback(async (payload: UpdateTaskPayload) => {
        if (!taskId) return
        
        try {
            const updatedTask = await taskService.updateTask(taskId, payload)
            setTask(updatedTask)
            return updatedTask
        } catch (err: any) {
            setError(err.message || 'Failed to update task')
            throw err
        }
    }, [taskId])

    const updateStatus = useCallback(async (status: string) => {
        if (!taskId) return
        
        try {
            const updatedTask = await taskService.updateTaskStatus(taskId, status)
            setTask(updatedTask)
            return updatedTask
        } catch (err: any) {
            setError(err.message || 'Failed to update task status')
            throw err
        }
    }, [taskId])



    const deleteTask = useCallback(async () => {
        if (!taskId) return
        
        try {
            await taskService.deleteTask(taskId)
        } catch (err: any) {
            setError(err.message || 'Failed to delete task')
            throw err
        }
    }, [taskId])

    // Auto-fetch on mount or taskId change
    useEffect(() => {
        fetchTask()
    }, [taskId, fetchTask])

    return {
        task,
        labels,
        subtasks,
        loading,
        error,
        fetchTask,
        updateTask,
        updateStatus,
        deleteTask,
        refresh: fetchTask
    }
}
