"use client"

import { AuthLayout } from "@/components/auth/AuthLayout"
import { RegisterForm } from "@/components/auth/RegisterForm"
import { FeaturesGrid } from "@/components/marketing/FeaturesGrid"
import { AchievementsSection } from "@/components/marketing/StatsSection"
import { useRegisterForm } from "@/hooks/useAuthForm"
import { registerBenefits, registerAchievements } from "@/data/features"
import Link from "next/link"
import { ROUTES } from "@/constants/routes"

export default function RegisterPage() {
    const {
        loading,
        formData,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
    } = useRegisterForm()

    const marketingContent = (
        <>
            <FeaturesGrid features={registerBenefits} />
            <div className="my-6 border-t border-gray-200 dark:border-gray-700"></div>
            <AchievementsSection achievements={registerAchievements} />
        </>
    )

    const footerContent = (
        <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
                Đã có tài khoản?{' '}
                <Link
                    href={ROUTES.LOGIN}
                    className="font-medium text-primary hover:underline"
                >
                    Đăng nhập ngay
                </Link>
            </p>
            <p className="text-xs text-muted-foreground">
                Bằng cách đăng ký, bạn đồng ý với{' '}
                <Link href="#" className="underline hover:text-primary">
                    Điều khoản dịch vụ
                </Link>{' '}
                và{' '}
                <Link href="#" className="underline hover:text-primary">
                    Chính sách bảo mật
                </Link>
            </p>
        </div>
    )

    return (
        <AuthLayout
            title="Tạo tài khoản mới"
            subtitle="Bắt đầu hành trình quản lý công việc thông minh"
            marketingContent={marketingContent}
            footerContent={footerContent}
            brandingProps={{
                title: "Smart Task Management",
                subtitle: "Nâng tầm năng suất với AI",
                description: "Tham gia cùng hàng nghìn người dùng đã chọn Smart Task để tối ưu hóa công việc",
                gradientFrom: "from-purple-600",
                gradientTo: "to-blue-600"
            }}
            backgroundGradient="from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-950"
        >
            <RegisterForm
                formData={formData}
                errors={errors}
                touched={touched}
                loading={loading}
                onSubmit={handleSubmit}
                onChange={handleChange}
                onBlur={handleBlur}
            />
        </AuthLayout>
    )
}