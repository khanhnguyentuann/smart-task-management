import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/core/utils/logger'

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:3001'

export async function GET(request: NextRequest) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/users`, {
            headers: {
                'Authorization': request.headers.get('authorization') || '',
                'Content-Type': 'application/json',
            },
        })

        const data = await response.json()
        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        logger.error('Users API proxy error', 'UsersAPI', error)
        return NextResponse.json(
            { success: false, message: 'Failed to fetch users' },
            { status: 500 }
        )
    }
}
