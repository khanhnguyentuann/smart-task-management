import { useState, useEffect, useCallback } from 'react'
import { projectService } from '../services/project.service'
import type { Project } from '../lib'

export const useProjectDetail = (projectId: string | null) => {
    const [project, setProject] = useState<Project | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchProject = useCallback(async () => {
        if (!projectId) return

        try {
            setLoading(true)
            setError(null)
            const data = await projectService.getProject(projectId)
            setProject(data)
        } catch (err: any) {
            setError(err.message || 'Failed to fetch project')
        } finally {
            setLoading(false)
        }
    }, [projectId])

    const refreshProject = useCallback(() => {
        fetchProject()
    }, [fetchProject])

    useEffect(() => {
        fetchProject()
    }, [fetchProject])

    return {
        project,
        loading,
        error,
        refreshProject
    }
}