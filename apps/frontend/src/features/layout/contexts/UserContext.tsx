"use client"

import { createContext, useContext, useCallback, ReactNode } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useUserProfile, userKeys } from "@/features/user"
import { cookieUtils } from "@/core/utils/cookie.utils"
import { TOKEN_CONSTANTS } from "@/core/constants/tokens"
import type { UserProfile } from "@/features/user/types/user.types"

interface UserContextType {
  user: UserProfile | null
  setUser: (user: UserProfile | null) => void
  isLoading: boolean
  isInitialized: boolean
  refetchUser: () => Promise<UserProfile | null>
  clearUser: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

  // Sử dụng useUserProfile hook với caching
  const {
    data: user,
    isLoading,
    isFetched,
    refetch
  } = useUserProfile()

  const setUser = useCallback((newUser: UserProfile | null) => {
    // Update cache trực tiếp thay vì state
    queryClient.setQueryData(userKeys.profile(), newUser)
  }, [queryClient])

  const refetchUser = useCallback(async (): Promise<UserProfile | null> => {
    const result = await refetch()
    return (result.data as UserProfile) || null
  }, [refetch])

  const clearUser = useCallback(() => {
    // Clear user data và remove từ cache
    queryClient.setQueryData(userKeys.profile(), null)
    queryClient.removeQueries({ queryKey: userKeys.profile() })

    // Clear cookies
    cookieUtils.deleteCookie(TOKEN_CONSTANTS.ACCESS_TOKEN)
    cookieUtils.deleteCookie(TOKEN_CONSTANTS.REFRESH_TOKEN)
  }, [queryClient])

  // Tính toán isInitialized dựa trên query state
  const isInitialized = isFetched || !cookieUtils.getCookie(TOKEN_CONSTANTS.ACCESS_TOKEN)

  return (
    <UserContext.Provider value={{
      user: (user as UserProfile) || null,
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
