import { useCallback, useState, useEffect } from 'react'
import { labelService } from '../services'
import type { Label } from '../types'

export function useTaskLabels(taskId: string) {
    const [labels, setLabels] = useState<Label[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchLabels = useCallback(async () => {
        if (!taskId) return
        
        setLoading(true)
        setError(null)
        try {
            const data = await labelService.getTaskLabels(taskId)
            setLabels(data)
        } catch (err: any) {
            setError(err.message || 'Failed to load labels')
        } finally {
            setLoading(false)
        }
    }, [taskId])

    const addLabel = useCallback(async (name: string, color?: string) => {
        if (!taskId) return
        
        try {
            const newLabel = await labelService.addLabel(taskId, name, color)
            setLabels(prev => [...prev, newLabel])
            return newLabel
        } catch (err: any) {
            setError(err.message || 'Failed to add label')
            throw err
        }
    }, [taskId])

    const removeLabel = useCallback(async (labelId: string) => {
        if (!taskId) return
        
        try {
            await labelService.removeLabel(taskId, labelId)
            setLabels(prev => prev.filter(label => label.id !== labelId))
        } catch (err: any) {
            setError(err.message || 'Failed to remove label')
            throw err
        }
    }, [taskId])

    const updateLabel = useCallback(async (labelId: string, name: string, color: string) => {
        try {
            const updatedLabel = await labelService.updateLabel(labelId, name, color)
            setLabels(prev => prev.map(label => 
                label.id === labelId ? updatedLabel : label
            ))
            return updatedLabel
        } catch (err: any) {
            setError(err.message || 'Failed to update label')
            throw err
        }
    }, [])

    // Auto-fetch on mount or taskId change
    useEffect(() => {
        fetchLabels()
    }, [fetchLabels])

    return {
        labels,
        loading,
        error,
        fetchLabels,
        addLabel,
        removeLabel,
        updateLabel,
        refresh: fetchLabels
    }
}
