import { useToast as useToastOriginal } from "@/shared/components/ui/use-toast"
import { ToastProps } from "@/shared/types/global.types"

export const useToast = () => {
  const { toast } = useToastOriginal()

  const showToast = (props: ToastProps) => {
    toast({
      title: props.title,
      description: props.description,
      variant: props.variant,
    })
  }

  const showSuccess = (title: string, description?: string) => {
    showToast({ title, description, variant: "success" })
  }

  const showError = (title: string, description?: string) => {
    showToast({ title, description, variant: "destructive" })
  }

  const showInfo = (title: string, description?: string) => {
    showToast({ title, description, variant: "default" })
  }

  return {
    toast: showToast,
    success: showSuccess,
    error: showError,
    info: showInfo,
  }
} 