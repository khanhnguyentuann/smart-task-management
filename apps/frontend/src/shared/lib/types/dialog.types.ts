import { BaseComponentProps } from '@/shared/lib/types/base.types'

export interface DialogProps extends BaseComponentProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}