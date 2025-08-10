import { useCallback, useState, useEffect } from 'react'
import { subtaskService } from '../services'
import type { Subtask } from '../types'

export function useSubtasks(taskId: string) {
    const [subtasks, setSubtasks] = useState<Subtask[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchSubtasks = useCallback(async () => {
        if (!taskId) return
        
        setLoading(true)
        setError(null)
        try {
            const data = await subtaskService.getTaskSubtasks(taskId)
            setSubtasks(data)
        } catch (err: any) {
            setError(err.message || 'Failed to load subtasks')
        } finally {
            setLoading(false)
        }
    }, [taskId])

    const addSubtask = useCallback(async (title: string) => {
        if (!taskId) return
        
        try {
            const newSubtask = await subtaskService.addSubtask(taskId, title)
            setSubtasks(prev => [...prev, newSubtask])
            return newSubtask
        } catch (err: any) {
            setError(err.message || 'Failed to add subtask')
            throw err
        }
    }, [taskId])

    const updateSubtask = useCallback(async (subtaskId: string, title: string) => {
        if (!taskId) return
        
        try {
            const updatedSubtask = await subtaskService.updateSubtask(taskId, subtaskId, title)
            setSubtasks(prev => prev.map(subtask => 
                subtask.id === subtaskId ? updatedSubtask : subtask
            ))
            return updatedSubtask
        } catch (err: any) {
            setError(err.message || 'Failed to update subtask')
            throw err
        }
    }, [taskId])

    const deleteSubtask = useCallback(async (subtaskId: string) => {
        if (!taskId) return
        
        try {
            await subtaskService.deleteSubtask(taskId, subtaskId)
            setSubtasks(prev => prev.filter(subtask => subtask.id !== subtaskId))
        } catch (err: any) {
            setError(err.message || 'Failed to delete subtask')
            throw err
        }
    }, [taskId])

    const toggleSubtask = useCallback(async (subtaskId: string) => {
        if (!taskId) return
        
        try {
            const updatedSubtask = await subtaskService.toggleSubtask(taskId, subtaskId)
            setSubtasks(prev => prev.map(subtask => 
                subtask.id === subtaskId ? updatedSubtask : subtask
            ))
            return updatedSubtask
        } catch (err: any) {
            setError(err.message || 'Failed to toggle subtask')
            throw err
        }
    }, [taskId])

    // Calculate progress
    const progress = subtaskService.getProgress(subtasks)

    // Auto-fetch on mount or taskId change
    useEffect(() => {
        fetchSubtasks()
    }, [fetchSubtasks])

    return {
        subtasks,
        loading,
        error,
        progress,
        fetchSubtasks,
        addSubtask,
        updateSubtask,
        deleteSubtask,
        toggleSubtask,
        refresh: fetchSubtasks
    }
}
