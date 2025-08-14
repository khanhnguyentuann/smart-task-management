import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '../services/user.service'
import { useErrorHandler } from '@/shared/hooks'
import { cookieUtils } from '@/core/utils/cookie.utils'
import { TOKEN_CONSTANTS } from '@/shared/constants'
import type { UserProfile, UpdateProfilePayload } from '../types/user.types'

// Query keys for consistent caching
export const userKeys = {
  all: ['user'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
}

/**
 * Hook để fetch user profile với caching và background refetch
 */
export function useUserProfile() {
  const { handleError } = useErrorHandler({
    context: { component: 'useUserProfile' }
  })

  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: () => userService.getProfile(),
    // Only fetch when token is available
    enabled: !!cookieUtils.getCookie(TOKEN_CONSTANTS.ACCESS_TOKEN),
    // Stale time: 3 minutes - profile doesn't change frequently
    staleTime: 3 * 60 * 1000,
    // Cache time: 15 minutes
    gcTime: 15 * 60 * 1000,
    // Fewer retries for profile since errors are usually auth-related
    retry: (failureCount: number, error: any) => {
      // Don't retry if it's an auth error (401, 403)
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false
      }
      return failureCount < 2
    },
    // Throw error để component có thể handle
    throwOnError: (error: any) => {
      handleError(error)
      if (error?.response?.status === 401) {
        // Clear tokens nếu unauthorized
        cookieUtils.deleteCookie(TOKEN_CONSTANTS.ACCESS_TOKEN)
        cookieUtils.deleteCookie(TOKEN_CONSTANTS.REFRESH_TOKEN)
      }
      return false // Don't throw, just handle
    },
  })
}

/**
 * Hook để update user profile với optimistic updates
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const { handleError } = useErrorHandler({
    context: { component: 'useUpdateProfile' }
  })

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => userService.updateProfile(payload),
    // Optimistic update
    onMutate: async (newProfile) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({ queryKey: userKeys.profile() })

      // Snapshot previous value
      const previousProfile = queryClient.getQueryData<UserProfile>(userKeys.profile())

      // Optimistically update
      queryClient.setQueryData<UserProfile>(userKeys.profile(), (old) => {
        if (!old) return old
        return { ...old, ...newProfile }
      })

      return { previousProfile }
    },
    // Rollback on error
    onError: (error, variables, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(userKeys.profile(), context.previousProfile)
      }
      handleError(error)
    },
    // Refetch on success để đảm bảo data consistency
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() })
    },
  })
}

/**
 * Hook để upload avatar
 */
export function useUploadAvatar() {
  const queryClient = useQueryClient()
  const { handleError } = useErrorHandler({
    context: { component: 'useUploadAvatar' }
  })

  return useMutation<Pick<UserProfile, 'avatar'>, any, { file?: File; base64?: string }>({
    mutationFn: ({ file, base64 }) => {
      if (file) {
        return userService.uploadAvatarFile(file)
      } else if (base64) {
        return userService.uploadAvatarBase64(base64)
      }
      throw new Error('Either file or base64 must be provided')
    },
    onSuccess: (data) => {
      // Update cache với avatar mới
      queryClient.setQueryData<UserProfile>(userKeys.profile(), (old) => {
        if (!old) return old
        return { ...old, avatar: data.avatar }
      })
    },
    onError: (error) => handleError(error),
  })
}

/**
 * Hook để prefetch user profile
 */
export function usePrefetchUserProfile() {
  const queryClient = useQueryClient()

  return () => {
    queryClient.prefetchQuery({
      queryKey: userKeys.profile(),
      queryFn: () => userService.getProfile(),
      staleTime: 3 * 60 * 1000,
    })
  }
}