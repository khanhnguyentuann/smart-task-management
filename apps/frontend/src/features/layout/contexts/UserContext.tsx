"use client"

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react"
import { userService } from "@/features/user"
import { useErrorHandler } from "@/shared/hooks"
import type { User } from "@/shared/lib/types"

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  isLoading: boolean
  refetchUser: () => Promise<void>
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
    } catch (error: any) {
      handleErrorRef.current(error)
    }
  }, []) // No dependencies needed

  useEffect(() => {
    // Only fetch user profile once on mount
    if (!isInitialized) {
      refetchUser().finally(() => {
        setIsLoading(false)
        setIsInitialized(true)
      })
    }
  }, [refetchUser, isInitialized])

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, refetchUser }}>
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
