// API Error types
export interface ApiErrorResponse {
    message: string
    statusCode?: number
    errors?: Record<string, string[]>
}

export interface ApiError {
    response?: {
        status: number
        data: ApiErrorResponse
    }
    message: string
    name: string
}

// Auth Service types
export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    email: string
    password: string
    firstName: string
    lastName: string
    role: "ADMIN" | "MEMBER"
}

export interface AuthResponse {
    user: {
        id: string
        email: string
        firstName: string
        lastName: string
        role: string
    }
    token: string
}

// Utility function to check if error is ApiError
export function isApiError(error: unknown): error is ApiError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as ApiError).message === 'string'
    )
}

// Extract error message from unknown error
export function getErrorMessage(error: unknown): string {
    if (isApiError(error)) {
        if (error.response?.data?.message) {
            return error.response.data.message
        }
        return error.message
    }

    if (error instanceof Error) {
        return error.message
    }

    return 'An unexpected error occurred'
}