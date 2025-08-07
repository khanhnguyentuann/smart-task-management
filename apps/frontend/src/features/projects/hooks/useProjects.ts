import { useState, useEffect, useCallback } from 'react'
import { projectsApi } from '../api/projects.api'
import type { Project, CreateProjectData, UpdateProjectData } from '../types'

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await projectsApi.getProjects()
      setProjects(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }, [])

  const createProject = useCallback(async (projectData: CreateProjectData): Promise<Project> => {
    try {
      setError(null)
      const newProject = await projectsApi.createProject(projectData)
      setProjects(prev => [...prev, newProject])
      return newProject
    } catch (err: any) {
      setError(err.message || 'Failed to create project')
      throw err
    }
  }, [])

  const updateProject = useCallback(async (id: string, projectData: UpdateProjectData): Promise<Project> => {
    try {
      setError(null)
      const updatedProject = await projectsApi.updateProject(id, projectData)
      setProjects(prev => prev.map(project => 
        project.id === id ? updatedProject : project
      ))
      return updatedProject
    } catch (err: any) {
      setError(err.message || 'Failed to update project')
      throw err
    }
  }, [])

  const deleteProject = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await projectsApi.deleteProject(id)
      setProjects(prev => prev.filter(project => project.id !== id))
    } catch (err: any) {
      setError(err.message || 'Failed to delete project')
      throw err
    }
  }, [])

  const getProject = useCallback(async (id: string): Promise<Project> => {
    try {
      setError(null)
      return await projectsApi.getProject(id)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch project')
      throw err
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    getProject
  }
} 