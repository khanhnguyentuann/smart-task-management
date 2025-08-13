import { createCrudHandlers } from '@/core/utils/api-wrapper'

const handlers = createCrudHandlers('/api/users/profile', 'UserProfileAPI')

export const GET = handlers.GET
export const PATCH = handlers.PATCH
