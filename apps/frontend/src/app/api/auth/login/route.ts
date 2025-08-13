import { createAuthHandler } from '@/core/utils/api-wrapper'

export const POST = createAuthHandler('/api/auth/login')
