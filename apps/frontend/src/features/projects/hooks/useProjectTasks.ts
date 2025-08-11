import { useState, useCallback } from 'react'
import { projectTasksService } from '../services/project-tasks.service'

export const useProjectTasks = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getProjectTasks = useCallback(async (projectId: string) => {
        try {
            setLoading(true)
            setError(null)
            const tasks = await projectTasksService.getProjectTasks(projectId)
            return tasks
        } catch (err: any) {
            setError(err.message || 'Failed to fetch project tasks')
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    const createProjectTask = useCallback(async (projectId: string, taskData: any) => {
        try {
            setLoading(true)
            setError(null)
            const result = await projectTasksService.createProjectTask(projectId, taskData)
            return result
        } catch (err: any) {
            setError(err.message || 'Failed to create project task')
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    return {
        loading,
        error,
        getProjectTasks,
        createProjectTask
    }
}