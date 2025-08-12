import { useCallback } from 'react'
import { useToast } from '@/shared/hooks/useToast'
import { errorService, ErrorType, AppError } from '@/core/services/error.service'

interface UseErrorHandlerOptions {
    showToast?: boolean
    logError?: boolean
    context?: AppError['context']
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
    const { showToast = true, logError = true, context } = options
    const { toast } = useToast()

    const handleError = useCallback((
        error: any,
        type: ErrorType = ErrorType.UNKNOWN,
        customMessage?: string
    ) => {
        // Create standardized error
        const appError = errorService.handleApiError(error, context)

        // Show toast notification if enabled
        if (showToast) {
            const message = customMessage || appError.message
            toast({
                title: 'Error',
                description: message,
                variant: 'destructive',
            })
        }

        // Log error if enabled
        if (logError) {
            console.error('Error handled by useErrorHandler:', {
                error: appError,
                originalError: error,
                context
            })
        }

        return appError
    }, [showToast, logError, context, toast])

    const handleValidationError = useCallback((
        error: any,
        field?: string
    ) => {
        const appError = errorService.handleValidationError(error, field)

        if (showToast) {
            toast({
                title: 'Validation Error',
                description: appError.message,
                variant: 'destructive',
            })
        }

        return appError
    }, [showToast, toast])

    const handleNetworkError = useCallback((
        error: any
    ) => {
        const appError = errorService.createError(error, ErrorType.NETWORK, undefined, context)

        if (showToast) {
            toast({
                title: 'Network Error',
                description: appError.message,
                variant: 'destructive',
            })
        }

        return appError
    }, [showToast, context, toast])

    const handleAuthError = useCallback((
        error: any
    ) => {
        const appError = errorService.createError(error, ErrorType.AUTHENTICATION, undefined, context)

        if (showToast) {
            toast({
                title: 'Authentication Error',
                description: appError.message,
                variant: 'destructive',
            })
        }

        // Redirect to login for auth errors
        if (typeof window !== 'undefined' && appError.code === 'AUTH_TOKEN_EXPIRED') {
            setTimeout(() => {
                window.location.href = '/login'
            }, 2000)
        }

        return appError
    }, [showToast, context, toast])

    return {
        handleError,
        handleValidationError,
        handleNetworkError,
        handleAuthError,
        errorService
    }
}
