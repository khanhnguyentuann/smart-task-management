import { NextRequest, NextResponse } from 'next/server'
import { apiClient } from '@/core/services/api-client'
import { API_ROUTES } from '@/core/constants/routes'
import { TOKEN_CONSTANTS } from '@/core/constants/tokens'
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
    const response = await apiClient.post(API_ROUTES.AUTH.REFRESH, {
      refreshToken
    })

    // Set new tokens in HttpOnly cookies for security
    const nextResponse = NextResponse.json(response)

    nextResponse.cookies.set(TOKEN_CONSTANTS.ACCESS_TOKEN, response.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    })

    if (response.refreshToken) {
      nextResponse.cookies.set(TOKEN_CONSTANTS.REFRESH_TOKEN, response.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
    }

    return nextResponse
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
