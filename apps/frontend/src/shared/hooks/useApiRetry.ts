import { useCallback, useState } from 'react'
import { apiClient } from '@/core/services/api-client'
import { RetryUtils } from '@/core/utils/retry.utils'
import { logger } from '@/core/utils/logger'

interface UseApiRetryOptions {
    maxAttempts?: number
    baseDelay?: number
    maxDelay?: number
    onRetry?: (attempt: number, error: any) => void
    onMaxAttemptsReached?: (error: any) => void
    onSuccess?: (data: any) => void
    onError?: (error: any) => void
}

export function useApiRetry(options: UseApiRetryOptions = {}) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [data, setData] = useState<any>(null)

    const executeRequest = useCallback(async <T>(
        requestFn: () => Promise<T>,
        customOptions?: Partial<UseApiRetryOptions>
    ): Promise<T> => {
        const config = { ...options, ...customOptions }
        setIsLoading(true)
        setError(null)

        try {
            const result = await RetryUtils.retry(requestFn, {
                maxAttempts: config.maxAttempts || 3,
                baseDelay: config.baseDelay || 1000,
                maxDelay: config.maxDelay || 30000,
                onRetry: (attempt, error) => {
                    logger.info('Retrying API request from component', 'useApiRetry', {
                        attempt,
                        error: error.message
                    })
                    config.onRetry?.(attempt, error)
                },
                onMaxAttemptsReached: (error) => {
                    logger.error('Max retry attempts reached in component', 'useApiRetry', {
                        error: error.message
                    })
                    config.onMaxAttemptsReached?.(error)
                }
            })

            setData(result)
            config.onSuccess?.(result)
            return result
        } catch (err: any) {
            const error = err instanceof Error ? err : new Error(err.message || 'Unknown error')
            setError(error)
            config.onError?.(error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }, [options])

    const get = useCallback(async <T>(url: string, config?: any): Promise<T> => {
        return executeRequest(() => apiClient.get<T>(url, config))
    }, [executeRequest])

    const post = useCallback(async <T>(url: string, data?: any, config?: any): Promise<T> => {
        return executeRequest(() => apiClient.post<T>(url, data, config))
    }, [executeRequest])

    const put = useCallback(async <T>(url: string, data?: any, config?: any): Promise<T> => {
        return executeRequest(() => apiClient.put<T>(url, data, config))
    }, [executeRequest])

    const patch = useCallback(async <T>(url: string, data?: any, config?: any): Promise<T> => {
        return executeRequest(() => apiClient.patch<T>(url, data, config))
    }, [executeRequest])

    const del = useCallback(async <T>(url: string, config?: any): Promise<T> => {
        return executeRequest(() => apiClient.delete<T>(url, config))
    }, [executeRequest])

    const reset = useCallback(() => {
        setError(null)
        setData(null)
        setIsLoading(false)
    }, [])

    return {
        executeRequest,
        get,
        post,
        put,
        patch,
        delete: del,
        isLoading,
        error,
        data,
        reset
    }
}
