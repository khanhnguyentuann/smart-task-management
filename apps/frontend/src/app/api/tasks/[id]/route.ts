import { NextRequest, NextResponse } from 'next/server'
import { proxyUtils } from '@/core/utils/proxy.utils'
import { logger } from '@/core/utils/logger'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = request.headers.get('authorization')?.replace('Bearer ', '')
        const { data, status } = await proxyUtils.get(`/api/tasks/${params.id}`, token)

        return NextResponse.json(data, { status })
    } catch (error: any) {
        logger.error('Task detail API proxy error', 'TaskDetailAPI', error)
        return NextResponse.json(
            { success: false, message: 'Failed to fetch task' },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json()
        const token = request.headers.get('authorization')?.replace('Bearer ', '')
        const { data, status } = await proxyUtils.put(`/api/tasks/${params.id}`, body, token)

        return NextResponse.json(data, { status })
    } catch (error: any) {
        logger.error('Task update API proxy error', 'TaskDetailAPI', error)
        return NextResponse.json(
            { success: false, message: 'Failed to update task' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = request.headers.get('authorization')?.replace('Bearer ', '')
        const { data, status } = await proxyUtils.delete(`/api/tasks/${params.id}`, token)

        return NextResponse.json(data, { status })
    } catch (error: any) {
        logger.error('Task delete API proxy error', 'TaskDetailAPI', error)
        return NextResponse.json(
            { success: false, message: 'Failed to delete task' },
            { status: 500 }
        )
    }
}
