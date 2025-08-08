import { useState, useEffect, useCallback } from 'react'
import { authService } from '../services'
import { formatAuthError } from '../utils'
import type { User, AuthState, LoginCredentials, RegisterCredentials } from '../types'
import { AUTH_CONSTANTS } from '../constants'

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true
  })

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      const user = authService.getUser()
      const isAuthenticated = authService.isAuthenticated()

      setState({
        user,
        isAuthenticated,
        loading: false
      })
    }

    initAuth()
  }, [])

  // Auto refresh token every 4 minutes
  useEffect(() => {
    if (!state.isAuthenticated) return

    const interval = setInterval(async () => {
      try {
        const refreshToken = authService.getRefreshToken()
        if (refreshToken) {
          const { apiService } = await import('@/core/services/api')
          const response = await apiService.refreshToken(refreshToken)
          const newToken = (response as any).accessToken || (response as any).token
          if (newToken) {
            localStorage.setItem(AUTH_CONSTANTS.TOKEN_KEY, newToken)
          }
        }
      } catch (error) {
        console.error('Auto refresh token failed:', error)
        // Don't logout on auto refresh failure, let the API handle it
      }
    }, 4 * 60 * 1000) // 4 minutes

    return () => clearInterval(interval)
  }, [state.isAuthenticated])

  const login = useCallback(async (credentials: LoginCredentials): Promise<User> => {
    setState(prev => ({ ...prev, loading: true }))

    try {
      const user = await authService.login(credentials)
      setState({
        user,
        isAuthenticated: true,
        loading: false
      })
      return user
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }))
      throw new Error(formatAuthError(error))
    }
  }, [])

  const register = useCallback(async (credentials: RegisterCredentials): Promise<User> => {
    setState(prev => ({ ...prev, loading: true }))

    try {
      const user = await authService.register(credentials)
      setState({
        user,
        isAuthenticated: true,
        loading: false
      })
      return user
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }))
      throw new Error(formatAuthError(error))
    }
  }, [])

  const logout = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true }))

    try {
      await authService.logout()
      setState({
        user: null,
        isAuthenticated: false,
        loading: false
      })
    } catch (error) {
      // Still clear state even if logout API fails
      setState({
        user: null,
        isAuthenticated: false,
        loading: false
      })
      throw new Error(formatAuthError(error))
    }
  }, [])

  const updateUser = useCallback((user: User) => {
    authService.setUser(user)
    setState(prev => ({
      ...prev,
      user
    }))
  }, [])

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    login,
    register,
    logout,
    updateUser
  }
}