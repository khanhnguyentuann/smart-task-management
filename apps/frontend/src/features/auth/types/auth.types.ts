export interface User {
  id: string
  name: string
  email: string
  role: "Admin" | "Member"
  avatar: string
  department: string
}

export interface AuthFormData {
  name: string
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