import { createCrudHandlers } from '@/core/utils/api-wrapper'

const handlers = createCrudHandlers('/api/projects', 'ProjectsAPI')

export const GET = handlers.GET
export const POST = handlers.POST
