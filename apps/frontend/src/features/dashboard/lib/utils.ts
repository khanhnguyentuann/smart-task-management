import { DASHBOARD_CONSTANTS } from "./constants"

export const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} hours ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} days ago`

    return `${Math.floor(diffInDays / 7)} weeks ago`
}

export const getStatusColor = (status: string): string => {
    return DASHBOARD_CONSTANTS.STATUS_COLORS[status as keyof typeof DASHBOARD_CONSTANTS.STATUS_COLORS] ||
        DASHBOARD_CONSTANTS.STATUS_COLORS.default
}

export const getGreeting = (firstName: string): { message: string; emoji: string } => {
    const hour = new Date().getHours()

    if (hour < DASHBOARD_CONSTANTS.TIME_THRESHOLDS.morning) {
        return {
            message: `${DASHBOARD_CONSTANTS.GREETING_MESSAGES.morning}, ${firstName}!`,
            emoji: DASHBOARD_CONSTANTS.EMOJIS.morning
        }
    } else if (hour < DASHBOARD_CONSTANTS.TIME_THRESHOLDS.afternoon) {
        return {
            message: `${DASHBOARD_CONSTANTS.GREETING_MESSAGES.afternoon}, ${firstName}!`,
            emoji: DASHBOARD_CONSTANTS.EMOJIS.afternoon
        }
    } else {
        return {
            message: `${DASHBOARD_CONSTANTS.GREETING_MESSAGES.evening}, ${firstName}!`,
            emoji: DASHBOARD_CONSTANTS.EMOJIS.evening
        }
    }
}

export const calculateProgress = (value: number, target: number): number => {
    return Math.min((value / target) * 100, 100)
}

export const getTrendDirection = (value: number): "up" | "down" | "neutral" => {
    if (value > 0) return "up"
    if (value < 0) return "down"
    return "neutral"
}
