import { useState, useCallback } from 'react'
import { projectService } from '../services/project.service'
import type { CreateProjectData, UpdateProjectData, Project } from '../lib'

export const useProjectForm = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const createProject = useCallback(async (projectData: CreateProjectData): Promise<Project> => {
        try {
            setLoading(true)
            setError(null)
            const result = await projectService.createProject(projectData)
            return result
        } catch (err: any) {
            setError(err.message || 'Failed to create project')
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    const updateProject = useCallback(async (id: string, projectData: UpdateProjectData): Promise<Project> => {
        try {
            setLoading(true)
            setError(null)
            const result = await projectService.updateProject(id, projectData)
            return result
        } catch (err: any) {
            setError(err.message || 'Failed to update project')
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    return {
        loading,
        error,
        createProject,
        updateProject
    }
}