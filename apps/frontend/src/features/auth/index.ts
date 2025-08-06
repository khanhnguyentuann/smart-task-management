// Export components
export { AuthModal } from './components'

// Export hooks
export { useAuth } from './hooks'

// Export types
export type {
    User,
    AuthState,
    AuthTokens,
    AuthResponse,
    LoginCredentials,
    RegisterCredentials,
    AuthModalProps
} from './types'

// Export constants
export { AUTH_CONSTANTS } from './constants'

// Export services (if needed by other features)
export { authService } from './services'