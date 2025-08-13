import { NextRequest, NextResponse } from 'next/server'
import { proxyUtils } from './proxy.utils'
import { logger } from './logger'
import { authenticateRequest, AuthenticatedRequest } from './auth.middleware'

export interface ApiHandlerConfig {
    requireAuth?: boolean
    logContext: string
    defaultErrorMessage: string
}

export interface ProxyConfig {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    url: string
    includeBody?: boolean
}

/**
 * Wrapper cho API routes với authentication và error handling tự động
 */
export function createApiHandler(
    config: ApiHandlerConfig,
    proxyConfig: ProxyConfig
) {
    return async (
        request: NextRequest,
        context?: { params?: Record<string, string> }
    ): Promise<NextResponse> => {
        try {
            let token: string | undefined
            let authenticatedRequest: AuthenticatedRequest | undefined

            // Handle authentication if required
            if (config.requireAuth) {
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

                authenticatedRequest = request as AuthenticatedRequest
                authenticatedRequest.user = authResult.user
                token = request.cookies.get('access_token')?.value ||
                    request.headers.get('authorization')?.replace('Bearer ', '')
            }

            // Parse request body if needed
            let body: any
            if (proxyConfig.includeBody && proxyConfig.method !== 'GET') {
                body = await request.json()
            }

            // Build URL with params if provided
            let url = proxyConfig.url
            if (context?.params) {
                Object.entries(context.params).forEach(([key, value]) => {
                    url = url.replace(`{${key}}`, value)
                })
            }

            // Make proxy request
            const { data, status } = await proxyUtils.proxyRequest(url, {
                method: proxyConfig.method,
                body,
                token
            })

            return NextResponse.json(data, { status })

        } catch (error: any) {
            logger.error(`${config.logContext} API proxy error`, config.logContext, error)
            return NextResponse.json(
                {
                    success: false,
                    message: config.defaultErrorMessage
                },
                { status: 500 }
            )
        }
    }
}

/**
 * Wrapper đặc biệt cho routes với params (như [id])
 */
export function createParamApiHandler(
    config: ApiHandlerConfig,
    proxyConfig: ProxyConfig
) {
    return async (
        request: NextRequest,
        { params }: { params: Record<string, string> }
    ): Promise<NextResponse> => {
        return createApiHandler(config, proxyConfig)(request, { params })
    }
}

/**
 * Helper để tạo multiple HTTP methods cho cùng một route
 */
export function createCrudHandlers(
    baseUrl: string,
    logContext: string,
    requireAuth: boolean = true
) {
    const baseConfig: ApiHandlerConfig = {
        requireAuth,
        logContext,
        defaultErrorMessage: `Failed to process ${logContext.toLowerCase()}`
    }

    return {
        GET: createApiHandler(baseConfig, {
            method: 'GET',
            url: baseUrl
        }),

        POST: createApiHandler(
            { ...baseConfig, defaultErrorMessage: `Failed to create ${logContext.toLowerCase()}` },
            {
                method: 'POST',
                url: baseUrl,
                includeBody: true
            }
        ),

        PUT: createApiHandler(
            { ...baseConfig, defaultErrorMessage: `Failed to update ${logContext.toLowerCase()}` },
            {
                method: 'PUT',
                url: baseUrl,
                includeBody: true
            }
        ),

        PATCH: createApiHandler(
            { ...baseConfig, defaultErrorMessage: `Failed to update ${logContext.toLowerCase()}` },
            {
                method: 'PATCH',
                url: baseUrl,
                includeBody: true
            }
        ),

        DELETE: createApiHandler(
            { ...baseConfig, defaultErrorMessage: `Failed to delete ${logContext.toLowerCase()}` },
            {
                method: 'DELETE',
                url: baseUrl
            }
        )
    }
}

/**
 * Helper đặc biệt cho auth routes (không cần authentication)
 */
export function createAuthHandler(
    url: string,
    method: 'POST' = 'POST',
    successMessage?: string
) {
    return async (request: NextRequest): Promise<NextResponse> => {
        try {
            const body = await request.json()
            const { data, status } = await proxyUtils.proxyRequest(url, {
                method,
                body
            })

            // Handle token setting for auth routes
            if ((status === 200 || status === 201) && data?.accessToken) {
                const response = NextResponse.json(data, { status })

                // Set access token cookie
                response.cookies.set('access_token', data.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 15 * 60 * 1000, // 15 minutes
                })

                // Set refresh token cookie if provided
                if (data.refreshToken) {
                    response.cookies.set('refresh_token', data.refreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax',
                        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                    })
                }

                return response
            }

            return NextResponse.json(data, { status })

        } catch (error: any) {
            const operation = url.includes('login') ? 'Login' :
                url.includes('register') ? 'Registration' : 'Authentication'

            logger.error(`${operation} API proxy error`, `Auth${operation}API`, error)
            return NextResponse.json(
                {
                    success: false,
                    message: `${operation} failed`
                },
                { status: 500 }
            )
        }
    }
}
