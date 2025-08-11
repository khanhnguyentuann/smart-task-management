"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { userService } from "@/features/user"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  avatar?: string
  department?: string
}

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

  const refetchUser = async () => {
    try {
      const profile = await userService.getProfile()
      setUser(profile)
      localStorage.setItem("smart-task-user", JSON.stringify(profile))
    } catch (error) {
      console.error("Failed to refetch user:", error)
    }
  }

  useEffect(() => {
    const savedUser = localStorage.getItem("smart-task-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      // Background hydrate profile
      refetchUser()
    }
    setIsLoading(false)
  }, [])

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
