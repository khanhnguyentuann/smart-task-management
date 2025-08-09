import { useCallback, useEffect, useState } from 'react'
import type { UpdateProfilePayload, UserProfile } from '../types/user.types'
import { userService } from '../services/user.service'
import { uploadAvatarSchema } from '../validation/user.validation'

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    try {
      const data = await userService.getProfile()
      setProfile(data)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProfile = useCallback(async (payload: UpdateProfilePayload) => {
    setLoading(true)
    try {
      const data = await userService.updateProfile(payload)
      setProfile(data)
      return data
    } finally {
      setLoading(false)
    }
  }, [])

  const uploadAvatar = useCallback(async (input: { file?: File; base64?: string }) => {
    setLoading(true)
    try {
      let result: { avatar?: string }
      if (input.file) {
        result = await userService.uploadAvatarFile(input.file)
      } else if (input.base64) {
        // validate base64 or URL
        const parsed = uploadAvatarSchema.safeParse({ avatar: input.base64 })
        if (!parsed.success) {
          throw new Error('Invalid avatar data')
        }
        result = await userService.uploadAvatarBase64(parsed.data.avatar)
      } else {
        return profile
      }
      if (result?.avatar) {
        const next = { ...(profile as UserProfile), avatar: result.avatar }
        setProfile(next)
        return next
      }
      return profile
    } finally {
      setLoading(false)
    }
  }, [profile])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return { profile, setProfile, loading, fetchProfile, updateProfile, uploadAvatar }
}


