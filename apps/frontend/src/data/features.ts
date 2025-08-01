import { LucideIcon, Zap, Users, BarChart3, Shield, Globe, Award, Star, TrendingUp } from "lucide-react"

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
    { number: "50K+", label: "Active Users" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" },
    { number: "150+", label: "Countries" }
]

// Benefits for register page
export const registerBenefits: Feature[] = [
    {
        icon: Zap,
        title: "Boost Productivity",
        description: "Tăng hiệu suất làm việc lên 300% với AI automation"
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
    { icon: Users, number: "100K+", label: "Happy Users" },
    { icon: Star, number: "4.9/5", label: "Rating" },
    { icon: TrendingUp, number: "300%", label: "Productivity Boost" },
    { icon: Globe, number: "150+", label: "Countries" }
]