import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { TOKEN_CONSTANTS } from '@/core/constants/tokens'
import { jwtUtils } from '@/core/utils/jwt.utils'
import { logger } from '@/core/utils/logger'

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/health',
  '/favicon.ico',
  '/_next',
  '/static',
  '/images',
  '/icons'
]

// Protected routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/projects',
  '/tasks',
  '/profile',
  '/settings',
  '/notifications',
  '/help-support'
]

// API routes that require authentication
const PROTECTED_API_ROUTES = [
  '/api/projects',
  '/api/tasks',
  '/api/users',
  '/api/dashboard'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and Next.js internal routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Check if route is public
  const isPublicRoute = PUBLIC_ROUTES.some(route =>
    pathname === route || pathname.startsWith(route)
  )

  // Check if route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route)
  )

  // Check if API route is protected
  const isProtectedApiRoute = PROTECTED_API_ROUTES.some(route =>
    pathname.startsWith(route)
  )

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Get token from cookies or headers
  const token = request.cookies.get(TOKEN_CONSTANTS.ACCESS_TOKEN)?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '')

  // If no token and trying to access protected route, redirect to login
  if (!token && (isProtectedRoute || isProtectedApiRoute)) {
    if (isProtectedApiRoute) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If token exists, validate it
  if (token) {
    try {
      // Verify JWT token
      const payload = await jwtUtils.verifyToken(token)

      // Check if token is expired
      if (payload.exp && payload.exp < Date.now() / 1000) {
        // Token expired, try to refresh
        const refreshToken = request.cookies.get(TOKEN_CONSTANTS.REFRESH_TOKEN)?.value

        if (refreshToken) {
          try {
            // Attempt to refresh token
            const refreshResponse = await fetch(`${request.nextUrl.origin}/api/auth/refresh`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refreshToken }),
            })

            if (refreshResponse.ok) {
              const { accessToken } = await refreshResponse.json()

              // Create response with new token
              const response = NextResponse.next()
              response.cookies.set(TOKEN_CONSTANTS.ACCESS_TOKEN, accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 15 * 60 * 1000, // 15 minutes
              })

              return response
            }
          } catch (error) {
            // Refresh failed, redirect to login
            logger.error('Token refresh failed', 'Middleware', error)
          }
        }

        // No refresh token or refresh failed, redirect to login
        if (isProtectedApiRoute) {
          return NextResponse.json(
            { success: false, message: 'Token expired' },
            { status: 401 }
          )
        }

        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
      }

      // Token is valid, allow access
      return NextResponse.next()
    } catch (error) {
      // Token is invalid, redirect to login
      logger.error('Token validation failed', 'Middleware', error)

      if (isProtectedApiRoute) {
        return NextResponse.json(
          { success: false, message: 'Invalid token' },
          { status: 401 }
        )
      }

      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Default: allow access
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) - we want to protect these
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
