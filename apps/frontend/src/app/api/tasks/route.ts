import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/core/utils/logger'

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:3001'

export async function GET(request: NextRequest) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/tasks`, {
            headers: {
                'Authorization': request.headers.get('authorization') || '',
                'Content-Type': 'application/json',
            },
        })

        const data = await response.json()
        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        logger.error('Tasks API proxy error', 'TasksAPI', error)
        return NextResponse.json(
            { success: false, message: 'Failed to fetch tasks' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const response = await fetch(`${BACKEND_URL}/api/tasks`, {
            method: 'POST',
            headers: {
                'Authorization': request.headers.get('authorization') || '',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })

        const data = await response.json()
        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        logger.error('Tasks API proxy error', 'TasksAPI', error)
        return NextResponse.json(
            { success: false, message: 'Failed to create task' },
            { status: 500 }
        )
    }
}
