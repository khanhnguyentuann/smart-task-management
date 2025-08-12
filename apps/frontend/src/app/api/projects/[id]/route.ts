import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/core/utils/logger'
import { proxyUtils } from '@/core/utils/proxy.utils'
import { withAuthParams, AuthenticatedRequest } from '@/core/utils/auth.middleware'

export const GET = withAuthParams(async (
  request: AuthenticatedRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const { data, status } = await proxyUtils.get(`/api/projects/${params.id}`, token)
    return NextResponse.json(data, { status })
  } catch (error) {
    logger.error('Project detail API proxy error', 'ProjectDetailAPI', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch project' },
      { status: 500 }
    )
  }
})

export const PATCH = withAuthParams(async (
  request: AuthenticatedRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const body = await request.json()
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const { data, status } = await proxyUtils.patch(`/api/projects/${params.id}`, body, token)
    return NextResponse.json(data, { status })
  } catch (error) {
    logger.error('Project update API proxy error', 'ProjectDetailAPI', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update project' },
      { status: 500 }
    )
  }
})

export const DELETE = withAuthParams(async (
  request: AuthenticatedRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const { data, status } = await proxyUtils.delete(`/api/projects/${params.id}`, token)
    return NextResponse.json(data, { status })
  } catch (error) {
    logger.error('Project delete API proxy error', 'ProjectDetailAPI', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete project' },
      { status: 500 }
    )
  }
})
