import { BaseComponentProps } from '@/shared/lib/types/base.types'

export interface ButtonProps extends BaseComponentProps {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon"
    disabled?: boolean
    onClick?: () => void
}