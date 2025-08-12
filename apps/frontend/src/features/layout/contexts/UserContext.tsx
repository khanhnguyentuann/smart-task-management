"use client"

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react"
import { userService } from "@/features/user"
import { useErrorHandler } from "@/shared/hooks"
import { cookieUtils } from "@/core/utils/cookie.utils"
import { TOKEN_CONSTANTS } from "@/core/constants/tokens"
import type { User } from "@/shared/lib/types"

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  isLoading: boolean
  isInitialized: boolean
  refetchUser: () => Promise<User | null>
  clearUser: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const { handleError } = useErrorHandler({
    context: { component: 'UserProvider' }
  })
  
  // Use ref to store handleError to avoid dependency issues
  const handleErrorRef = useRef(handleError)
  handleErrorRef.current = handleError

  const refetchUser = useCallback(async () => {
    try {
      const profile = await userService.getProfile()
      setUser(profile)
      return profile
    } catch (error: any) {
      handleErrorRef.current(error)
      // If token is invalid, clear user state
      if (error?.response?.status === 401) {
        setUser(null)
        cookieUtils.deleteCookie(TOKEN_CONSTANTS.ACCESS_TOKEN)
        cookieUtils.deleteCookie(TOKEN_CONSTANTS.REFRESH_TOKEN)
      }
      throw error
    }
  }, [])

  const clearUser = useCallback(() => {
    setUser(null)
    setIsInitialized(false)
  }, [])

  useEffect(() => {
    // Check if user has valid token before fetching profile
    const hasToken = cookieUtils.getCookie(TOKEN_CONSTANTS.ACCESS_TOKEN)
    
    if (hasToken) {
      // Only fetch user profile if token exists
      refetchUser()
        .then(() => {
          setIsLoading(false)
          setIsInitialized(true)
        })
        .catch(() => {
          // If fetch fails, still mark as initialized
          setIsLoading(false)
          setIsInitialized(true)
        })
    } else {
      // No token, mark as initialized without user
      setIsLoading(false)
      setIsInitialized(true)
    }
  }, [refetchUser])

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      isLoading, 
      isInitialized, 
      refetchUser, 
      clearUser 
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
