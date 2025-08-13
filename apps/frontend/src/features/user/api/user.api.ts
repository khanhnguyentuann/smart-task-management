import { apiClient } from '@/core/services/api-client'
import { API_ROUTES } from '@/shared/constants'
import type { UpdateProfilePayload, UserProfile } from '../types/user.types'

class UserApi {
  getProfile(): Promise<UserProfile> {
    return apiClient.get<UserProfile>(API_ROUTES.USERS.PROFILE)
  }

  updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
    return apiClient.patch<UserProfile>(API_ROUTES.USERS.UPDATE, payload)
  }

  async uploadAvatarBase64(avatarBase64: string): Promise<Pick<UserProfile, 'avatar'>> {
    return apiClient.post<Pick<UserProfile, 'avatar'>>(API_ROUTES.USERS.AVATAR, { avatar: avatarBase64 })
  }

  async uploadAvatarFile(file: File): Promise<Pick<UserProfile, 'avatar'>> {
    const form = new FormData()
    form.append('file', file)
    return apiClient.post<Pick<UserProfile, 'avatar'>>(API_ROUTES.USERS.AVATAR, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }
}

export const userApi = new UserApi()


