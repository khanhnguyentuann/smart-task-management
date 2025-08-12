import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { TOKEN_CONSTANTS } from '@/core/constants/tokens'
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

  // If token exists, allow access (token validation will be done in API routes)
  if (token) {
    // For API routes, just pass the token through
    if (isProtectedApiRoute) {
      return NextResponse.next()
    }

    // For protected routes, allow access if token exists
    return NextResponse.next()
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
