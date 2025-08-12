// Proxy utility for Next.js API routes to backend
export const proxyUtils = {
    async proxyRequest(
        url: string,
        options: {
            method?: string
            headers?: Record<string, string>
            body?: any
            token?: string
        } = {}
    ) {
        const {
            method = 'GET',
            headers = {},
            body,
            token
        } = options

        const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:3001'
        const fullUrl = `${backendUrl}${url}`

        const requestHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
            ...headers
        }

        if (token) {
            requestHeaders.Authorization = `Bearer ${token}`
        }

        const requestOptions: RequestInit = {
            method,
            headers: requestHeaders,
        }

        if (body && method !== 'GET') {
            requestOptions.body = JSON.stringify(body)
        }

        try {
            const response = await fetch(fullUrl, requestOptions)
            const data = await response.json()

            return {
                data,
                status: response.status,
                ok: response.ok
            }
        } catch (error: any) {
            throw new Error(`Proxy request failed: ${error.message}`)
        }
    },

    // Helper methods for common HTTP methods
    async get(url: string, token?: string) {
        return this.proxyRequest(url, { method: 'GET', token })
    },

    async post(url: string, body: any, token?: string) {
        return this.proxyRequest(url, { method: 'POST', body, token })
    },

    async put(url: string, body: any, token?: string) {
        return this.proxyRequest(url, { method: 'PUT', body, token })
    },

    async patch(url: string, body: any, token?: string) {
        return this.proxyRequest(url, { method: 'PATCH', body, token })
    },

    async delete(url: string, token?: string) {
        return this.proxyRequest(url, { method: 'DELETE', token })
    }
}
