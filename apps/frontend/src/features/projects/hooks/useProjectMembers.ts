import { useState, useCallback } from 'react'
import { projectMembersService } from '../services/project-members.service'

export const useProjectMembers = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const addProjectMembers = useCallback(async (projectId: string, memberIds: string[]) => {
        try {
            setLoading(true)
            setError(null)
            const result = await projectMembersService.addProjectMembers(projectId, memberIds)
            return result
        } catch (err: any) {
            setError(err.message || 'Failed to add project members')
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    const removeProjectMember = useCallback(async (projectId: string, memberId: string) => {
        try {
            setLoading(true)
            setError(null)
            await projectMembersService.removeProjectMember(projectId, memberId)
        } catch (err: any) {
            setError(err.message || 'Failed to remove project member')
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    return {
        loading,
        error,
        addProjectMembers,
        removeProjectMember
    }
}