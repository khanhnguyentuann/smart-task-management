import { createCrudHandlers } from '@/core/utils/api-wrapper'

const handlers = createCrudHandlers('/users', 'UsersAPI')

export const GET = handlers.GET
