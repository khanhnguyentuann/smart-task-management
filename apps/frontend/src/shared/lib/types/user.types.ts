// Shared User interface for reusability across features
export interface User {
    id: string
    firstName: string
    lastName: string
    email: string
    avatar?: string
    department?: string
    dateOfBirth?: string
    createdAt?: string
}

// Extended user types for specific use cases
export interface UserProfile extends User {
    // Additional profile fields can be added here
}

export interface BaseUser extends Pick<User, 'id' | 'firstName' | 'lastName' | 'avatar' | 'email'> {
    // Minimal user info for components that don't need full user data
}

// User selection types
export interface UserOption {
    value: string
    label: string
    avatar?: string
    email: string
}

// User update payload
export type UpdateUserPayload = Partial<Pick<User, 'firstName' | 'lastName' | 'department' | 'dateOfBirth' | 'avatar'>>
