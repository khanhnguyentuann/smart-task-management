import { useState, useCallback } from 'react'
import { projectService } from '../services/project.service'
import type { Project } from '../lib'

export const useProjectsList = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const searchProjects = useCallback(async (query: string) => {
        try {
            setLoading(true)
            setError(null)
            const projects = await projectService.searchProjects(query)
            return projects
        } catch (err: any) {
            setError(err.message || 'Failed to search projects')
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    return {
        loading,
        error,
        searchProjects
    }
}