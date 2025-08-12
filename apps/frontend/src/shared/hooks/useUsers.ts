import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/core/services/api-client'
import { API_ROUTES } from '@/core/constants/routes'
import type { User } from '@/shared/lib/types'

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchUsers = useCallback(async (search?: string) => {
        try {
            setLoading(true)
            setError(null)
            const url = search ? `${API_ROUTES.USERS.LIST}?search=${encodeURIComponent(search)}` : API_ROUTES.USERS.LIST
            const response = await apiClient.get(url)
            setUsers(Array.isArray(response) ? response : [])
        } catch (err: any) {
            setError(err.message || 'Failed to fetch users')
            setUsers([]) // Ensure users is always an array
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    return {
        users,
        loading,
        error,
        fetchUsers
    }
}
