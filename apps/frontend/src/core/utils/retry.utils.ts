import { errorService } from '@/core/services/error.service'
import { logger } from './logger'

interface RetryOptions {
    maxAttempts?: number
    baseDelay?: number
    maxDelay?: number
    onRetry?: (attempt: number, error: any) => void
    onMaxAttemptsReached?: (error: any) => void
}

export class RetryUtils {
    private static defaultOptions: Required<RetryOptions> = {
        maxAttempts: 3,
        baseDelay: 1000,
        maxDelay: 30000,
        onRetry: () => { },
        onMaxAttemptsReached: () => { }
    }

    static async retry<T>(
        operation: () => Promise<T>,
        options: RetryOptions = {}
    ): Promise<T> {
        const config = { ...this.defaultOptions, ...options }
        let attempt = 0

        while (attempt < config.maxAttempts) {
            try {
                attempt++
                return await operation()
            } catch (error) {
                const appError = errorService.handleApiError(error)

                // Check if error is retryable
                if (!errorService.isRetryable(appError)) {
                    logger.warn('Non-retryable error encountered', 'RetryUtils', {
                        error: appError.message,
                        code: appError.code,
                        attempt
                    })
                    throw error
                }

                // If this is the last attempt, throw the error
                if (attempt >= config.maxAttempts) {
                    logger.error('Max retry attempts reached', 'RetryUtils', {
                        error: appError.message,
                        code: appError.code,
                        attempts: attempt
                    })
                    config.onMaxAttemptsReached(error)
                    throw error
                }

                // Calculate delay with exponential backoff
                const delay = errorService.getRetryDelay(appError, attempt)

                // Call onRetry callback
                config.onRetry(attempt, error)

                logger.info('Retrying API request', 'RetryUtils', {
                    attempt,
                    delay,
                    error: appError.message,
                    code: appError.code
                })

                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, delay))
            }
        }

        throw new Error('Max retry attempts reached')
    }

    static async retryWithBackoff<T>(
        operation: () => Promise<T>,
        options: RetryOptions = {}
    ): Promise<T> {
        return this.retry(operation, options)
    }

    static isRetryableError(error: any): boolean {
        const appError = errorService.handleApiError(error)
        return errorService.isRetryable(appError)
    }

    static getRetryDelay(error: any, attempt: number): number {
        const appError = errorService.handleApiError(error)
        return errorService.getRetryDelay(appError, attempt)
    }
}
