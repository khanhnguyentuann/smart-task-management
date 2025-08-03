"use client"

import Link from "next/link"
import { useLoginForm } from "@/hooks/useAuthForm"
import { ROUTES } from "@/constants/routes"
import { AuthLayout } from "@/components/auth/AuthLayout"
import { QuickLogin } from "@/components/auth/QuickLogin"
import { LoginForm } from "@/components/auth/LoginForm"
import { FeaturesGrid } from "@/components/marketing/FeaturesGrid"
import { StatsSection } from "@/components/marketing/StatsSection"
import { mockUsers } from "@/data/mock-users"
import { authFeatures, authStats } from "@/data/features"

export default function LoginPage() {
    const { loading, formData, errors, handleChange, handleSubmit, handleQuickLogin } = useLoginForm()

    const marketingContent = (
        <>
            <FeaturesGrid features={authFeatures} />
            <StatsSection stats={authStats} />
        </>
    )

    const footerContent = (
        <p className="text-sm text-center text-muted-foreground w-full">
            Chưa có tài khoản?{' '}
            <Link
                href={ROUTES.REGISTER}
                className="text-primary font-medium hover:underline transition-colors"
            >
                Đăng ký ngay
            </Link>
        </p>
    )

    return (
        <AuthLayout
            title="Đăng nhập"
            subtitle="Chọn tài khoản hoặc nhập thông tin"
            marketingContent={marketingContent}
            footerContent={footerContent}
            brandingProps={{
                title: "Smart Task",
                subtitle: "Quản lý công việc thông minh",
                description: "Chào mừng trở lại! 👋"
            }}
        >
            <div className="space-y-6">
                <QuickLogin
                    users={mockUsers}
                    onLogin={handleQuickLogin}
                    loading={loading}
                />

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-gray-900 px-2 text-muted-foreground">Hoặc tiếp tục với</span>
                    </div>
                </div>

                <LoginForm
                    formData={formData}
                    errors={errors}
                    loading={loading}
                    onSubmit={handleSubmit}
                    onChange={handleChange}
                />
            </div>
        </AuthLayout>
    )
}