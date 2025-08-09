// Core domain types
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  createdAt: string
  avatar?: string
  department?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse extends AuthTokens {
  user: User
}

// API payloads (DTOs)
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  firstName: string
  lastName: string
  email: string
  password: string
}

// UI types
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
}

export type RegisterProps = {
  onSuccess: (user: User) => void
  onClose: () => void
}

export type LoginProps = {
  onSuccess: (user: User) => void
  onClose: () => void
}

export interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLogin: (user: User) => void
}

// Backend response shape used by auth endpoints
export interface AuthApiResponse {
  accessToken?: string
  token?: string
  refreshToken?: string
  user: User
}