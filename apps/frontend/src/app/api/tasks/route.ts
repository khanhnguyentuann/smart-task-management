import { createCrudHandlers } from '@/core/utils/api-wrapper'

const handlers = createCrudHandlers('/tasks', 'TasksAPI')

export const GET = handlers.GET
export const POST = handlers.POST
