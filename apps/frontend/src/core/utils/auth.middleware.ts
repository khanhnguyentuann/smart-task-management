import { NextRequest, NextResponse } from 'next/server'
import { jwtUtils } from './jwt.utils'
import { logger } from './logger'
import { TOKEN_CONSTANTS } from '@/core/constants/tokens'
import type { User } from '@/shared/lib/types'

// JWT payload only contains minimal user info
interface JWTUser {
    id: string
    email: string
    sub: string
    iat?: number
    exp?: number
}

export interface AuthenticatedRequest extends NextRequest {
    user?: JWTUser
}

export async function authenticateRequest(request: NextRequest): Promise<{
    success: boolean
    user?: JWTUser
    error?: string
    status?: number
}> {
    try {
        // Get token from cookies or headers
        const token = request.cookies.get(TOKEN_CONSTANTS.ACCESS_TOKEN)?.value ||
            request.headers.get('authorization')?.replace('Bearer ', '')

        if (!token) {
            return {
                success: false,
                error: 'No authentication token provided',
                status: 401
            }
        }

        // Verify JWT token server-side
        const payload = await jwtUtils.verifyToken(token)

        // Check if token is expired
        if (payload.exp && payload.exp < Date.now() / 1000) {
            return {
                success: false,
                error: 'Token expired',
                status: 401
            }
        }

        // Extract user information from token
        if (!payload.sub || !payload.email) {
            return {
                success: false,
                error: 'Invalid token payload',
                status: 401
            }
        }

        const user: JWTUser = {
            id: payload.sub,
            email: payload.email,
            sub: payload.sub,
            iat: payload.iat,
            exp: payload.exp
        }

        return {
            success: true,
            user
        }
    } catch (error) {
        logger.error('Token verification failed', 'AuthMiddleware', error)
        return {
            success: false,
            error: 'Invalid authentication token',
            status: 401
        }
    }
}

export function withAuth(handler: (request: AuthenticatedRequest) => Promise<NextResponse>) {
    return async (request: NextRequest): Promise<NextResponse> => {
        const authResult = await authenticateRequest(request)

        if (!authResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: authResult.error || 'Authentication required'
                },
                { status: authResult.status || 401 }
            )
        }

        // Add user to request
        const authenticatedRequest = request as AuthenticatedRequest
        authenticatedRequest.user = authResult.user

        return handler(authenticatedRequest)
    }
}

export function withAuthParams<T extends Record<string, any>>(
    handler: (request: AuthenticatedRequest, params: T) => Promise<NextResponse>
) {
    return async (request: NextRequest, params: T): Promise<NextResponse> => {
        const authResult = await authenticateRequest(request)

        if (!authResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: authResult.error || 'Authentication required'
                },
                { status: authResult.status || 401 }
            )
        }

        // Add user to request
        const authenticatedRequest = request as AuthenticatedRequest
        authenticatedRequest.user = authResult.user

        return handler(authenticatedRequest, params)
    }
}

export async function refreshTokenIfNeeded(request: NextRequest): Promise<{
    success: boolean
    newToken?: string
    error?: string
}> {
    try {
        const refreshToken = request.cookies.get(TOKEN_CONSTANTS.REFRESH_TOKEN)?.value

        if (!refreshToken) {
            return {
                success: false,
                error: 'No refresh token available'
            }
        }

        // Call refresh endpoint
        const response = await fetch(`${request.nextUrl.origin}/api/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        })

        if (!response.ok) {
            return {
                success: false,
                error: 'Token refresh failed'
            }
        }

        const { accessToken } = await response.json()

        return {
            success: true,
            newToken: accessToken
        }
    } catch (error) {
        logger.error('Token refresh failed', 'AuthMiddleware', error)
        return {
            success: false,
            error: 'Token refresh failed'
        }
    }
}
