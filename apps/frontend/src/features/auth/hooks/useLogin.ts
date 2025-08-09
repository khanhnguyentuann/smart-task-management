import { useCallback, useState } from 'react'
import { authService } from '../services'
import type { LoginCredentials, AuthResponse } from '../types'

export function useLogin() {
  const [loading, setLoading] = useState(false)
  // Removed unused error state

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setLoading(true)
    try {
      return await authService.login(credentials)
    } catch (err: any) {
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { login, loading }
}


