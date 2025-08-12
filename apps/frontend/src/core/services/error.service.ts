import { logger } from '@/core/utils/logger'

// Error types for better categorization
export enum ErrorType {
    NETWORK = 'network',
    AUTHENTICATION = 'authentication',
    VALIDATION = 'validation',
    SERVER = 'server',
    CLIENT = 'client',
    UNKNOWN = 'unknown'
}

// Error severity levels
export enum ErrorSeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical'
}

// Standardized error interface
export interface AppError {
    type: ErrorType
    severity: ErrorSeverity
    message: string
    code?: string
    details?: any
    timestamp: string
    context?: {
        url?: string
        method?: string
        userId?: string
        component?: string
    }
}

// Error codes for consistent messaging
export const ERROR_CODES = {
    // Network errors
    NETWORK_TIMEOUT: 'NETWORK_TIMEOUT',
    NETWORK_OFFLINE: 'NETWORK_OFFLINE',
    NETWORK_UNREACHABLE: 'NETWORK_UNREACHABLE',

    // Authentication errors
    AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
    AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
    AUTH_REQUIRED: 'AUTH_REQUIRED',
    AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',

    // Validation errors
    VALIDATION_REQUIRED: 'VALIDATION_REQUIRED',
    VALIDATION_INVALID_FORMAT: 'VALIDATION_INVALID_FORMAT',
    VALIDATION_TOO_LONG: 'VALIDATION_TOO_LONG',
    VALIDATION_TOO_SHORT: 'VALIDATION_TOO_SHORT',

    // Server errors
    SERVER_INTERNAL: 'SERVER_INTERNAL',
    SERVER_UNAVAILABLE: 'SERVER_UNAVAILABLE',
    SERVER_TIMEOUT: 'SERVER_TIMEOUT',

    // Client errors
    CLIENT_NOT_FOUND: 'CLIENT_NOT_FOUND',
    CLIENT_FORBIDDEN: 'CLIENT_FORBIDDEN',
    CLIENT_BAD_REQUEST: 'CLIENT_BAD_REQUEST',

    // Unknown errors
    UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const

// User-friendly error messages
export const ERROR_MESSAGES = {
    [ERROR_CODES.NETWORK_TIMEOUT]: 'Request timed out. Please check your connection and try again.',
    [ERROR_CODES.NETWORK_OFFLINE]: 'You appear to be offline. Please check your internet connection.',
    [ERROR_CODES.NETWORK_UNREACHABLE]: 'Unable to reach the server. Please try again later.',

    [ERROR_CODES.AUTH_TOKEN_EXPIRED]: 'Your session has expired. Please log in again.',
    [ERROR_CODES.AUTH_TOKEN_INVALID]: 'Invalid authentication. Please log in again.',
    [ERROR_CODES.AUTH_REQUIRED]: 'Authentication required. Please log in to continue.',
    [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: 'Invalid email or password. Please try again.',

    [ERROR_CODES.VALIDATION_REQUIRED]: 'This field is required.',
    [ERROR_CODES.VALIDATION_INVALID_FORMAT]: 'Invalid format. Please check your input.',
    [ERROR_CODES.VALIDATION_TOO_LONG]: 'Input is too long. Please shorten it.',
    [ERROR_CODES.VALIDATION_TOO_SHORT]: 'Input is too short. Please provide more details.',

    [ERROR_CODES.SERVER_INTERNAL]: 'Something went wrong on our end. Please try again later.',
    [ERROR_CODES.SERVER_UNAVAILABLE]: 'Service temporarily unavailable. Please try again later.',
    [ERROR_CODES.SERVER_TIMEOUT]: 'Server is taking too long to respond. Please try again.',

    [ERROR_CODES.CLIENT_NOT_FOUND]: 'The requested resource was not found.',
    [ERROR_CODES.CLIENT_FORBIDDEN]: 'You don\'t have permission to access this resource.',
    [ERROR_CODES.CLIENT_BAD_REQUEST]: 'Invalid request. Please check your input.',

    [ERROR_CODES.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.'
} as const

class ErrorService {
    private errorQueue: AppError[] = []
    private maxQueueSize = 100

    // Create standardized error from various error sources
    createError(
        error: Error | string | any,
        type: ErrorType = ErrorType.UNKNOWN,
        severity: ErrorSeverity = ErrorSeverity.MEDIUM,
        context?: AppError['context']
    ): AppError {
        const message = typeof error === 'string' ? error : error?.message || 'Unknown error'
        const code = this.determineErrorCode(error, type)

        const appError: AppError = {
            type,
            severity,
            message: ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES] || message,
            code,
            details: error,
            timestamp: new Date().toISOString(),
            context: {
                url: typeof window !== 'undefined' ? window.location.href : undefined,
                ...context
            }
        }

        this.logError(appError)
        this.queueError(appError)

        return appError
    }

    // Determine error code based on error type and content
    private determineErrorCode(error: any, type: ErrorType): string {
        if (type === ErrorType.NETWORK) {
            if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
                return ERROR_CODES.NETWORK_TIMEOUT
            }
            if (error?.message?.includes('offline') || !navigator.onLine) {
                return ERROR_CODES.NETWORK_OFFLINE
            }
            return ERROR_CODES.NETWORK_UNREACHABLE
        }

        if (type === ErrorType.AUTHENTICATION) {
            if (error?.status === 401) {
                return ERROR_CODES.AUTH_TOKEN_EXPIRED
            }
            if (error?.message?.includes('invalid') || error?.message?.includes('credentials')) {
                return ERROR_CODES.AUTH_INVALID_CREDENTIALS
            }
            return ERROR_CODES.AUTH_REQUIRED
        }

        if (type === ErrorType.VALIDATION) {
            if (error?.message?.includes('required')) {
                return ERROR_CODES.VALIDATION_REQUIRED
            }
            if (error?.message?.includes('format')) {
                return ERROR_CODES.VALIDATION_INVALID_FORMAT
            }
            return ERROR_CODES.VALIDATION_REQUIRED
        }

        if (type === ErrorType.SERVER) {
            if (error?.status >= 500) {
                return ERROR_CODES.SERVER_INTERNAL
            }
            if (error?.status === 503) {
                return ERROR_CODES.SERVER_UNAVAILABLE
            }
            return ERROR_CODES.SERVER_INTERNAL
        }

        if (type === ErrorType.CLIENT) {
            if (error?.status === 404) {
                return ERROR_CODES.CLIENT_NOT_FOUND
            }
            if (error?.status === 403) {
                return ERROR_CODES.CLIENT_FORBIDDEN
            }
            if (error?.status === 400) {
                return ERROR_CODES.CLIENT_BAD_REQUEST
            }
        }

        return ERROR_CODES.UNKNOWN_ERROR
    }

    // Handle API errors specifically
    handleApiError(error: any, context?: AppError['context']): AppError {
        const status = error?.response?.status || error?.status

        let type = ErrorType.UNKNOWN
        let severity = ErrorSeverity.MEDIUM

        if (status >= 500) {
            type = ErrorType.SERVER
            severity = ErrorSeverity.HIGH
        } else if (status === 401 || status === 403) {
            type = ErrorType.AUTHENTICATION
            severity = ErrorSeverity.MEDIUM
        } else if (status === 400 || status === 422) {
            type = ErrorType.VALIDATION
            severity = ErrorSeverity.LOW
        } else if (status === 404) {
            type = ErrorType.CLIENT
            severity = ErrorSeverity.LOW
        } else if (!status && error?.message?.includes('Network')) {
            type = ErrorType.NETWORK
            severity = ErrorSeverity.MEDIUM
        }

        return this.createError(error, type, severity, context)
    }

    // Handle validation errors
    handleValidationError(error: any, field?: string): AppError {
        const context = field ? { component: field } : undefined
        return this.createError(error, ErrorType.VALIDATION, ErrorSeverity.LOW, context)
    }

    // Log error with structured logging
    private logError(error: AppError): void {
        const logData = {
            error: error.message,
            code: error.code,
            type: error.type,
            severity: error.severity,
            timestamp: error.timestamp,
            context: error.context,
            details: process.env.NODE_ENV === 'development' ? error.details : undefined
        }

        switch (error.severity) {
            case ErrorSeverity.CRITICAL:
                logger.error('Critical error occurred', 'ErrorService', logData)
                break
            case ErrorSeverity.HIGH:
                logger.error('High severity error', 'ErrorService', logData)
                break
            case ErrorSeverity.MEDIUM:
                logger.warn('Medium severity error', 'ErrorService', logData)
                break
            case ErrorSeverity.LOW:
                logger.info('Low severity error', 'ErrorService', logData)
                break
        }
    }

    // Queue error for batch reporting
    private queueError(error: AppError): void {
        this.errorQueue.push(error)

        // Keep queue size manageable
        if (this.errorQueue.length > this.maxQueueSize) {
            this.errorQueue = this.errorQueue.slice(-this.maxQueueSize)
        }

        // In production, you might want to batch send errors to external service
        if (process.env.NODE_ENV === 'production' && this.errorQueue.length >= 10) {
            this.flushErrorQueue()
        }
    }

    // Flush error queue to external service
    private flushErrorQueue(): void {
        if (this.errorQueue.length === 0) return

        // TODO: Send to external error reporting service (Sentry, LogRocket, etc.)
        console.log('Flushing error queue:', this.errorQueue.length, 'errors')

        // Clear queue after sending
        this.errorQueue = []
    }

    // Get error queue for debugging
    getErrorQueue(): AppError[] {
        return [...this.errorQueue]
    }

    // Clear error queue
    clearErrorQueue(): void {
        this.errorQueue = []
    }

    // Check if error is retryable
    isRetryable(error: AppError): boolean {
        return error.type === ErrorType.NETWORK ||
            error.type === ErrorType.SERVER ||
            error.code === ERROR_CODES.SERVER_TIMEOUT ||
            error.code === ERROR_CODES.NETWORK_TIMEOUT
    }

    // Get retry delay based on error type
    getRetryDelay(error: AppError, attempt: number): number {
        if (!this.isRetryable(error)) return 0

        // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
        const baseDelay = 1000
        const maxDelay = 30000
        const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay)

        return delay
    }
}

// Export singleton instance
export const errorService = new ErrorService()
export { ErrorService }
