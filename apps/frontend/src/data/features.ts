import { LucideIcon, Zap, Users, BarChart3, Shield, Globe, Award, Star, TrendingUp } from "lucide-react"
import { FEATURES_CONFIG } from "@/constants/config"

export interface Feature {
    icon: LucideIcon
    title: string
    description: string
}

export interface Stat {
    number: string
    label: string
}

export interface Achievement {
    icon: LucideIcon
    number: string
    label: string
}

// Features for login page
export const authFeatures: Feature[] = [
    {
        icon: Zap,
        title: "AI-Powered",
        description: "Intelligent task prioritization and automation"
    },
    {
        icon: Users,
        title: "Team Collaboration",
        description: "Real-time collaboration with your team"
    },
    {
        icon: BarChart3,
        title: "Analytics",
        description: "Detailed insights and progress tracking"
    },
    {
        icon: Shield,
        title: "Secure",
        description: "Enterprise-grade security and privacy"
    }
]

// Stats for login page
export const authStats: Stat[] = [
    { number: FEATURES_CONFIG.STATS.ACTIVE_USERS, label: "Active Users" },
    { number: FEATURES_CONFIG.STATS.UPTIME, label: "Uptime" },
    { number: FEATURES_CONFIG.STATS.SUPPORT, label: "Support" },
    { number: FEATURES_CONFIG.STATS.COUNTRIES, label: "Countries" }
]

// Benefits for register page
export const registerBenefits: Feature[] = [
    {
        icon: Zap,
        title: "Boost Productivity",
        description: `Tăng hiệu suất làm việc lên ${FEATURES_CONFIG.PRODUCTIVITY_BOOST_PERCENTAGE} với AI automation`
    },
    {
        icon: Users,
        title: "Team Collaboration",
        description: "Kết nối và làm việc nhóm hiệu quả hơn bao giờ hết"
    },
    {
        icon: BarChart3,
        title: "Smart Analytics",
        description: "Phân tích dữ liệu thông minh và báo cáo chi tiết"
    },
    {
        icon: Shield,
        title: "Enterprise Security",
        description: "Bảo mật cấp doanh nghiệp, an toàn tuyệt đối"
    },
    {
        icon: Globe,
        title: "Global Access",
        description: "Truy cập mọi lúc mọi nơi trên tất cả thiết bị"
    },
    {
        icon: Award,
        title: "Premium Support",
        description: "Hỗ trợ 24/7 từ đội ngũ chuyên gia hàng đầu"
    }
]

// Achievements for register page
export const registerAchievements: Achievement[] = [
    { icon: Users, number: FEATURES_CONFIG.STATS.HAPPY_USERS, label: "Happy Users" },
    { icon: Star, number: FEATURES_CONFIG.STATS.RATING, label: "Rating" },
    { icon: TrendingUp, number: FEATURES_CONFIG.STATS.PRODUCTIVITY_BOOST, label: "Productivity Boost" },
    { icon: Globe, number: FEATURES_CONFIG.STATS.COUNTRIES, label: "Countries" }
]