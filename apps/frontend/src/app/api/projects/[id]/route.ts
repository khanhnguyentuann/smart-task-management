import { createCrudHandlers } from '@/core/utils/api-wrapper'

const handlers = createCrudHandlers('/api/projects/{id}', 'ProjectDetailAPI')

export const GET = handlers.GET
export const PATCH = handlers.PATCH
export const DELETE = handlers.DELETE
