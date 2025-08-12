import { NextRequest, NextResponse } from 'next/server'
import { proxyUtils } from '@/core/utils/proxy.utils'
import { logger } from '@/core/utils/logger'
import { withAuth, AuthenticatedRequest } from '@/core/utils/auth.middleware'

export const GET = withAuth(async (request: AuthenticatedRequest) => {
    try {
        const token = request.headers.get('authorization')?.replace('Bearer ', '')
        const { data, status } = await proxyUtils.get('/api/projects', token)

        return NextResponse.json(data, { status })
    } catch (error: any) {
        logger.error('Projects API proxy error', 'ProjectsAPI', error)
        return NextResponse.json(
            { success: false, message: 'Failed to fetch projects' },
            { status: 500 }
        )
    }
})

export const POST = withAuth(async (request: AuthenticatedRequest) => {
    try {
        const body = await request.json()
        const token = request.headers.get('authorization')?.replace('Bearer ', '')
        const { data, status } = await proxyUtils.post('/api/projects', body, token)

        return NextResponse.json(data, { status })
    } catch (error: any) {
        logger.error('Projects API proxy error', 'ProjectsAPI', error)
        return NextResponse.json(
            { success: false, message: 'Failed to create project' },
            { status: 500 }
        )
    }
})
