import { createCrudHandlers } from '@/core/utils/api-wrapper'

const handlers = createCrudHandlers('/api/users', 'UsersAPI')

export const GET = handlers.GET
