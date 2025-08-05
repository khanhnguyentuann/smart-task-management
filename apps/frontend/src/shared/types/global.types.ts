export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface ButtonProps extends BaseComponentProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  disabled?: boolean
  onClick?: () => void
}

export interface CardProps extends BaseComponentProps {
  variant?: "default" | "glassmorphism"
}

export interface DialogProps extends BaseComponentProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export interface ToastProps {
  title: string
  description?: string
  variant?: "default" | "destructive" | "success"
}

export interface NavigationItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

export interface ThemeConfig {
  name: string
  value: string
  icon: React.ComponentType<{ className?: string }>
} 