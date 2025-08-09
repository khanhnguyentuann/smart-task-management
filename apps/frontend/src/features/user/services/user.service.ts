import type { UpdateProfilePayload, UserProfile } from '../types/user.types'
import { userApi } from '../api/user.api'

class UserService {
  getProfile(): Promise<UserProfile> {
    return userApi.getProfile()
  }

  updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
    return userApi.updateProfile(payload)
  }

  uploadAvatarBase64(avatarBase64: string) {
    return userApi.uploadAvatarBase64(avatarBase64)
  }

  uploadAvatarFile(file: File) {
    return userApi.uploadAvatarFile(file)
  }
}

export const userService = new UserService()


