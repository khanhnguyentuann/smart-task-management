import { AUTH_CONSTANTS, type PasswordStrength } from '@/shared/constants'

export const getStrengthMeta = (
  strength: PasswordStrength
): { label: string; textClass: string; barClass: string } => {
  switch (strength) {
    case AUTH_CONSTANTS.PASSWORD.STRENGTH_LEVELS.STRONG:
      return { label: 'Strong', textClass: 'text-green-500', barClass: 'bg-green-500' }
    case AUTH_CONSTANTS.PASSWORD.STRENGTH_LEVELS.MEDIUM:
      return { label: 'Medium', textClass: 'text-yellow-500', barClass: 'bg-yellow-500' }
    default:
      return { label: 'Weak', textClass: 'text-red-500', barClass: 'bg-red-500' }
  }
}