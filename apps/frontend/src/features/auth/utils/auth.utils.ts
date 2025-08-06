import { AUTH_CONSTANTS, type PasswordStrength } from '../constants'

export const generateAvatar = (firstName: string, lastName: string): string => {
  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase()
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName)}&background=random&color=fff&size=200`
}

export const getStrengthText = (strength: PasswordStrength): string => {
  const strengthMap = {
    [AUTH_CONSTANTS.PASSWORD.STRENGTH_LEVELS.WEAK]: 'Weak',
    [AUTH_CONSTANTS.PASSWORD.STRENGTH_LEVELS.MEDIUM]: 'Medium',
    [AUTH_CONSTANTS.PASSWORD.STRENGTH_LEVELS.STRONG]: 'Strong'
  }
  return strengthMap[strength] || 'Weak'
}

export const getStrengthColor = (strength: PasswordStrength): string => {
  const colorMap = {
    [AUTH_CONSTANTS.PASSWORD.STRENGTH_LEVELS.WEAK]: 'text-red-500',
    [AUTH_CONSTANTS.PASSWORD.STRENGTH_LEVELS.MEDIUM]: 'text-yellow-500',
    [AUTH_CONSTANTS.PASSWORD.STRENGTH_LEVELS.STRONG]: 'text-green-500'
  }
  return colorMap[strength] || 'text-red-500'
}

export const formatAuthError = (error: any): string => {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  if (error?.response?.data?.message) return error.response.data.message
  return AUTH_CONSTANTS.ERRORS.NETWORK_ERROR
}