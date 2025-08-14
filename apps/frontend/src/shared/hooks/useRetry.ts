import { useCallback, useRef } from 'react'
import { errorService } from '@/core/services/error.service'

interface UseRetryOptions {
    maxAttempts?: number
    baseDelay?: number
    maxDelay?: number
    onRetry?: (attempt: number, error: any) => void
    onMaxAttemptsReached?: (error: any) => void
}

export function useRetry(options: UseRetryOptions = {}) {
    const {
        maxAttempts = 3,
        baseDelay = 1000,
        maxDelay = 30000,
        onRetry,
        onMaxAttemptsReached
    } = options

    const attemptRef = useRef(0)

    const retry = useCallback(async <T>(
        operation: () => Promise<T>,
        customMaxAttempts?: number
    ): Promise<T> => {
        const maxAttemptsToUse = customMaxAttempts || maxAttempts
        attemptRef.current = 0

        while (attemptRef.current < maxAttemptsToUse) {
            try {
                attemptRef.current++
                return await operation()
            } catch (error) {
                const appError = errorService.handleApiError(error)

                // Check if error is retryable
                if (!errorService.isRetryable(appError)) {
                    throw error
                }

                // If this is the last attempt, throw the error
                if (attemptRef.current >= maxAttemptsToUse) {
                    onMaxAttemptsReached?.(error)
                    throw error
                }

                // Calculate delay with exponential backoff
                const delay = errorService.getRetryDelay(appError, attemptRef.current)

                // Call onRetry callback
                onRetry?.(attemptRef.current, error)

                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, delay))
            }
        }

        throw new Error('Max retry attempts reached')
    }, [maxAttempts, onRetry, onMaxAttemptsReached])

    const retryWithBackoff = useCallback(async <T>(
        operation: () => Promise<T>,
        customMaxAttempts?: number
    ): Promise<T> => {
        return retry(operation, customMaxAttempts)
    }, [retry])

    return {
        retry: retryWithBackoff,
        currentAttempt: attemptRef.current
    }
}
