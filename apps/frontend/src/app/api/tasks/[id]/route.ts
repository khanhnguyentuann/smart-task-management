import { createCrudHandlers } from '@/core/utils/api-wrapper'

const handlers = createCrudHandlers('/tasks/{id}', 'TaskDetailAPI')

export const GET = handlers.GET
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE
