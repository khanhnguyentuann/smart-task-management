import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/core/utils/logger'
import { proxyUtils } from '@/core/utils/proxy.utils'
import { withAuth, AuthenticatedRequest } from '@/core/utils/auth.middleware'

export const GET = withAuth(async (request: AuthenticatedRequest) => {
    try {
        const token = request.headers.get('authorization')?.replace('Bearer ', '')
        const { data, status } = await proxyUtils.get('/api/users', token)
        return NextResponse.json(data, { status })
    } catch (error) {
        logger.error('Users API proxy error', 'UsersAPI', error)
        return NextResponse.json(
            { success: false, message: 'Failed to fetch users' },
            { status: 500 }
        )
    }
})
