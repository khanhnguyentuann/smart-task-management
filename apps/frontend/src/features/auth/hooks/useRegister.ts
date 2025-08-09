import { useCallback, useState } from 'react'
import { authService } from '../services'
import type { RegisterCredentials, AuthResponse } from '../types'

export function useRegister() {
  const [loading, setLoading] = useState(false)
  // Removed unused error state

  const register = useCallback(async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    setLoading(true)
    try {
      return await authService.register(credentials)
    } catch (err: any) {
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { register, loading }
}


