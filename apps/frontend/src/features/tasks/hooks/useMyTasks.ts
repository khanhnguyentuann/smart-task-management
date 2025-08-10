import { useCallback, useState, useEffect } from 'react'
import { taskService } from '../services'
import type { Task } from '../types'

export function useMyTasks() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchTasks = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await taskService.getMyTasks()
            setTasks(data)
        } catch (err: any) {
            setError(err.message || 'Failed to load tasks')
        } finally {
            setLoading(false)
        }
    }, [])

    const updateTaskStatus = useCallback(async (id: string, status: string) => {
        try {
            const updatedTask = await taskService.updateTaskStatus(id, status)
            setTasks(prev => prev.map(task => 
                task.id === id ? updatedTask : task
            ))
            return updatedTask
        } catch (err: any) {
            setError(err.message || 'Failed to update task status')
            throw err
        }
    }, [])

    const createTask = useCallback(async (payload: any) => {
        try {
            const newTask = await taskService.createTask(payload)
            setTasks(prev => [newTask, ...prev])
            return newTask
        } catch (err: any) {
            setError(err.message || 'Failed to create task')
            throw err
        }
    }, [])

    const deleteTask = useCallback(async (id: string) => {
        try {
            await taskService.deleteTask(id)
            setTasks(prev => prev.filter(task => task.id !== id))
        } catch (err: any) {
            setError(err.message || 'Failed to delete task')
            throw err
        }
    }, [])

    // Auto-fetch on mount
    useEffect(() => {
        fetchTasks()
    }, [fetchTasks])

    return {
        tasks,
        loading,
        error,
        fetchTasks,
        updateTaskStatus,
        createTask,
        deleteTask,
        refresh: fetchTasks
    }
}
