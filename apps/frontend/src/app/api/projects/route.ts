import { createCrudHandlers } from '@/core/utils/api-wrapper'

const handlers = createCrudHandlers('/projects', 'ProjectsAPI')

export const GET = handlers.GET
export const POST = handlers.POST
