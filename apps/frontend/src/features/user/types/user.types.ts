import type { User, UpdateUserPayload } from '@/shared/lib/types'

// UserProfile extends the shared User interface
export interface UserProfile extends User {
  // Additional profile-specific fields can be added here
}

// Use shared UpdateUserPayload type
export type UpdateProfilePayload = UpdateUserPayload


