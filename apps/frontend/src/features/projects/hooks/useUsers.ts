import { useState, useEffect, useCallback } from 'react'
import { apiService } from '@/shared/services/api'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  createdAt: string
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async (search?: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getUsers(search)
      // Backend wraps response in { success: true, data: ..., timestamp: ... }
      const usersData = (response as any).data || response
      setUsers(Array.isArray(usersData) ? usersData : [])
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
