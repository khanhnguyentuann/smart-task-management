export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: "ADMIN" | "MEMBER"
  createdAt: string
  // Frontend-only fields for UI
  avatar?: string
  department?: string
}

export interface AuthFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword?: string
}

// API Response types
export interface AuthApiResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    role: "ADMIN" | "MEMBER"
    createdAt: string
  }
}

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

export interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLogin: (user: User) => void
}

export interface LoginFormProps {
  onSubmit: (data: AuthFormData) => void
  loading: boolean
}

export interface RegisterFormProps {
  onSubmit: (data: AuthFormData) => void
  loading: boolean
} 