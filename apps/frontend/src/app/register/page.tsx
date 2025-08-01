"use client"

import Link from "next/link"
import { useRegisterForm } from "@/hooks/useAuthForm"
import { AuthLayout } from "@/components/auth/AuthLayout"
import { RegisterForm } from "@/components/auth/RegisterForm"
import { FeaturesGrid } from "@/components/marketing/FeaturesGrid"
import { AchievementsSection } from "@/components/marketing/StatsSection"
import { registerBenefits, registerAchievements } from "@/data/features"

export default function RegisterPage() {
    const { loading, formData, errors, handleChange, handleSubmit } = useRegisterForm()

    const marketingContent = (
        <>
            <div className="space-y-4">
                <p className="text-xl text-muted-foreground leading-relaxed">
                    Trở thành một phần của cuộc cách mạng productivity. Miễn phí 30 ngày đầu, không cần thẻ tín dụng.
                </p>
            </div>
            <FeaturesGrid features={registerBenefits} columns={2} />
            <AchievementsSection achievements={registerAchievements} />
        </>
    )

    const footerContent = (
        <p className="text-sm text-center text-muted-foreground w-full">
            Đã có tài khoản?{' '}
            <Link
                href="/login"
                className="text-primary font-medium hover:underline transition-colors"
            >
                Đăng nhập ngay
            </Link>
        </p>
    )

    return (
        <AuthLayout
            title="Tạo tài khoản miễn phí"
            subtitle="Chỉ mất 2 phút để bắt đầu"
            marketingContent={marketingContent}
            footerContent={footerContent}
            brandingProps={{
                title: "Smart Task",
                subtitle: "Tương lai của quản lý dự án",
                description: "Gia nhập cộng đồng 100K+ 🚀",
                gradientFrom: "from-purple-600",
                gradientTo: "to-blue-600"
            }}
            backgroundGradient="from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950"
        >
            <RegisterForm
                formData={formData}
                errors={errors}
                loading={loading}
                onSubmit={handleSubmit}
                onChange={handleChange}
            />
        </AuthLayout>
    )
}