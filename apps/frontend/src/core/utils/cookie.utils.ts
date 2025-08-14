// Cookie utility functions for client-side only
// Note: HttpOnly cookies can only be set from server-side
export const cookieUtils = {
  setCookie(name: string, value: string, options: {
    maxAge?: number
    secure?: boolean
    sameSite?: 'strict' | 'lax' | 'none'
  } = {}) {
    // Client-side cookies (non-HttpOnly for backward compatibility)
    let cookieString = `${name}=${value}`
    
    if (options.maxAge) {
      cookieString += `; Max-Age=${options.maxAge}`
    }
    
    if (options.secure) {
      cookieString += '; Secure'
    }
    
    if (options.sameSite) {
      cookieString += `; SameSite=${options.sameSite}`
    }
    // Make cookie available across the entire site
    cookieString += '; Path=/'

    document.cookie = cookieString
  },

  getCookie(name: string): string | null {
    if (typeof window === 'undefined') {
      return null
    }
    
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null
    }
    return null
  },

  deleteCookie(name: string) {
    if (typeof window === 'undefined') {
      return
    }
    
    document.cookie = `${name}=; Max-Age=0; Path=/`
  },

  clearAllCookies() {
    if (typeof window === 'undefined') {
      return
    }
    
    const cookies = document.cookie.split(';')
    cookies.forEach(cookie => {
      const name = cookie.split('=')[0].trim()
      this.deleteCookie(name)
    })
  }
}
