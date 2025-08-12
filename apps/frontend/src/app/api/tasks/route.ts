import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/core/utils/logger'
import { proxyUtils } from '@/core/utils/proxy.utils'
import { withAuth, AuthenticatedRequest } from '@/core/utils/auth.middleware'

export const GET = withAuth(async (request: AuthenticatedRequest) => {
    try {
        const token = request.headers.get('authorization')?.replace('Bearer ', '')
        const { data, status } = await proxyUtils.get('/api/tasks', token)
        return NextResponse.json(data, { status })
    } catch (error) {
        logger.error('Tasks API proxy error', 'TasksAPI', error)
        return NextResponse.json(
            { success: false, message: 'Failed to fetch tasks' },
            { status: 500 }
        )
    }
})

export const POST = withAuth(async (request: AuthenticatedRequest) => {
    try {
        const body = await request.json()
        const token = request.headers.get('authorization')?.replace('Bearer ', '')
        const { data, status } = await proxyUtils.post('/api/tasks', body, token)
        return NextResponse.json(data, { status })
    } catch (error) {
        logger.error('Tasks API proxy error', 'TasksAPI', error)
        return NextResponse.json(
            { success: false, message: 'Failed to create task' },
            { status: 500 }
        )
    }
})
