export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  avatar?: string
  department?: string
  dateOfBirth?: string
  createdAt?: string
}

export type UpdateProfilePayload = Partial<Pick<UserProfile, 'firstName' | 'lastName' | 'department' | 'dateOfBirth' | 'avatar'>>


