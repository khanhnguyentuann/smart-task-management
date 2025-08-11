import { jwtVerify } from 'jose'

// JWT Secret - should match backend
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface JwtPayload {
    sub: string
    email?: string
    iat?: number
    exp?: number
}

export const jwtUtils = {
    async verifyToken(token: string): Promise<JwtPayload> {
        try {
            const { payload } = await jwtVerify(
                token,
                new TextEncoder().encode(JWT_SECRET)
            )

            return payload as JwtPayload
        } catch (error) {
            throw new Error('Invalid token')
        }
    },

    isTokenExpired(token: string): boolean {
        try {
            const payload = JSON.parse(atob(token.split('.')[1])) as JwtPayload
            return payload.exp ? payload.exp < Date.now() / 1000 : true
        } catch {
            return true
        }
    },

    getTokenPayload(token: string): JwtPayload | null {
        try {
            return JSON.parse(atob(token.split('.')[1])) as JwtPayload
        } catch {
            return null
        }
    }
}
