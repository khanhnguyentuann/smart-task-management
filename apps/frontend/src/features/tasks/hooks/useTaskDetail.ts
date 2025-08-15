import { useCallback, useState, useEffect } from 'react'
import { taskService } from '../services'
import { assigneeApi } from '../api/assignee.api'
import type { Task, UpdateTaskPayload } from '../types'

export function useTaskDetail(taskId: string) {
    const [task, setTask] = useState<Task | null>(null)
    const [labels, setLabels] = useState<any[]>([])
    const [subtasks, setSubtasks] = useState<any[]>([])
    const [assignees, setAssignees] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchTask = useCallback(async () => {
        if (!taskId) return
        setLoading(true)
        setError(null)
        try {
            const [taskData, labelsData, subtasksData, assigneesData] = await Promise.all([
                taskService.getTask(taskId),
                taskService.getTaskLabels(taskId),
                taskService.getTaskSubtasks(taskId),
                assigneeApi.getTaskAssignees(taskId)
            ])

            console.log('🔍 Frontend: Data loaded successfully:', {
                task: taskData?.id,
                labelsCount: labelsData?.length || 0,
                subtasksCount: subtasksData?.length || 0,
                assigneesCount: assigneesData?.length || 0
            })
            setTask(taskData)
            setLabels(labelsData)
            setSubtasks(subtasksData)
            setAssignees(assigneesData)
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

    const assignTask = useCallback(async (userId: string) => {
        if (!taskId) return
        
        try {
            const updatedTask = await taskService.assignTask(taskId, userId)
            setTask(updatedTask)
            return updatedTask
        } catch (err: any) {
            setError(err.message || 'Failed to assign task')
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
        assignees,
        loading,
        error,
        fetchTask,
        updateTask,
        updateStatus,
        assignTask,
        deleteTask,
        refresh: fetchTask
    }
}
