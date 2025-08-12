import { NextRequest, NextResponse } from 'next/server'
import { proxyUtils } from '@/core/utils/proxy.utils'
import { logger } from '@/core/utils/logger'
import { TOKEN_CONSTANTS } from '@/core/constants/tokens'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Call backend login endpoint
        const { data, status } = await proxyUtils.post('/api/auth/login', body)

        if (status === 200 && data) {
            // Set tokens in HttpOnly cookies for security
            const response = NextResponse.json(data, { status })

            response.cookies.set(TOKEN_CONSTANTS.ACCESS_TOKEN, data.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 15 * 60 * 1000, // 15 minutes
            })

            if (data.refreshToken) {
                response.cookies.set(TOKEN_CONSTANTS.REFRESH_TOKEN, data.refreshToken, {
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
        logger.error('Login API proxy error', 'AuthLoginAPI', error)
        return NextResponse.json(
            { success: false, message: 'Login failed' },
            { status: 500 }
        )
    }
}
