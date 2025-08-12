import { NextRequest, NextResponse } from 'next/server'
import { proxyUtils } from '@/core/utils/proxy.utils'
import { logger } from '@/core/utils/logger'

export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get('authorization')?.replace('Bearer ', '')
        const { data, status } = await proxyUtils.get('/api/users/profile', token)

        return NextResponse.json(data, { status })
    } catch (error: any) {
        logger.error('User profile API proxy error', 'UserProfileAPI', error)
        return NextResponse.json(
            { success: false, message: 'Failed to fetch user profile' },
            { status: 500 }
        )
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json()
        const token = request.headers.get('authorization')?.replace('Bearer ', '')
        const { data, status } = await proxyUtils.patch('/api/users/profile', body, token)

        return NextResponse.json(data, { status })
    } catch (error: any) {
        logger.error('User profile update API proxy error', 'UserProfileAPI', error)
        return NextResponse.json(
            { success: false, message: 'Failed to update user profile' },
            { status: 500 }
        )
    }
}
