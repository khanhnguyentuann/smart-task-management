// Cookie utility functions
export const cookieUtils = {
  setCookie(name: string, value: string, options: {
    maxAge?: number
    httpOnly?: boolean
    secure?: boolean
    sameSite?: 'strict' | 'lax' | 'none'
  } = {}) {
    if (typeof window === 'undefined') {
      // Server-side: use document.cookie
      let cookieString = `${name}=${value}`
      
      if (options.maxAge) {
        cookieString += `; Max-Age=${options.maxAge}`
      }
      
      if (options.httpOnly) {
        cookieString += '; HttpOnly'
      }
      
      if (options.secure) {
        cookieString += '; Secure'
      }
      
      if (options.sameSite) {
        cookieString += `; SameSite=${options.sameSite}`
      }
      
      document.cookie = cookieString
    } else {
      // Client-side: use document.cookie
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
      
      document.cookie = cookieString
    }
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
