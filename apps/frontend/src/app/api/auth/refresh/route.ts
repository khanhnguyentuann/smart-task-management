import { NextRequest, NextResponse } from 'next/server'
import { proxyUtils } from '@/core/utils/proxy.utils'
import { logger } from '@/core/utils/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { refreshToken } = body

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: 'Refresh token is required' },
        { status: 400 }
      )
    }

    // Call backend to refresh token
    const { data, status } = await proxyUtils.post('/api/auth/refresh', { refreshToken })

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
    logger.error('Token refresh failed', 'AuthRefreshAPI', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Token refresh failed'
      },
      { status: 401 }
    )
  }
}
