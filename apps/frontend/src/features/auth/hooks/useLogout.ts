import { useCallback, useState } from 'react'
import { authService } from '../services'

export function useLogout() {
  const [loading, setLoading] = useState(false)
  // Removed unused error state

  const logout = useCallback(async () => {
    setLoading(true)
    try {
      await authService.logout()
    } catch (err: any) {
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { logout, loading }
}


