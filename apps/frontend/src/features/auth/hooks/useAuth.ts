import { useState, useEffect } from "react"
import { authService } from "../services/authService"
import { User } from "../types/auth.types"

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = () => {
      const savedUser = authService.getUser()
      if (savedUser && authService.isAuthenticated()) {
        setUser(savedUser)
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const response = await authService.login(email, password)
      authService.setAuthToken(response.token)
      authService.setUser(response.user)
      setUser(response.user)
      console.log("Login successful")
      return response.user
    } catch (err) {
      console.error("Login failed:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true)
      const response = await authService.register(name, email, password)
      authService.setAuthToken(response.token)
      authService.setUser(response.user)
      setUser(response.user)
      console.log("Registration successful")
      return response.user
    } catch (err) {
      console.error("Registration failed:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
      console.log("Logged out successfully")
    } catch (err) {
      console.error("Logout error:", err)
    }
  }

  const updateUser = (updatedUser: User) => {
    authService.setUser(updatedUser)
    setUser(updatedUser)
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  }
} 