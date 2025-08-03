"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { BrandingSection } from "@/components/marketing/BrandingSection"
import { AuthLogo } from "@/components/common/AppLogo"

interface AuthLayoutProps {
    children: React.ReactNode
    marketingContent: React.ReactNode
    title: string
    subtitle: string
    footerContent?: React.ReactNode
    brandingProps?: {
        title?: string
        subtitle?: string
        description?: string
        gradientFrom?: string
        gradientTo?: string
    }
    backgroundGradient?: string
}

export function AuthLayout({
    children,
    marketingContent,
    title,
    subtitle,
    footerContent,
    brandingProps,
    backgroundGradient = "from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950"
}: AuthLayoutProps) {
    return (
        <div className={`min-h-screen flex flex-col bg-gradient-to-br ${backgroundGradient}`}>
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-[1400px] mx-auto">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Left Side - Marketing (Desktop only) */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="hidden lg:block space-y-6"
                        >
                            <BrandingSection {...brandingProps} />
                            <div className="max-h-[400px] overflow-y-auto pr-4 space-y-6 custom-scrollbar">
                                {marketingContent}
                            </div>
                        </motion.div>

                        {/* Mobile + Desktop Form Container */}
                        <div className="w-full max-w-[450px] mx-auto lg:ml-auto lg:mr-0 space-y-6">
                            {/* Mobile Branding - Chỉ hiển thị trên mobile và ở trên form */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="lg:hidden"
                            >
                                <BrandingSection {...brandingProps} />
                            </motion.div>

                            {/* Form */}
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <Card className="rounded-2xl shadow-2xl border-0 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
                                    <CardHeader className="space-y-3 text-center pt-6 pb-4">
                                        <motion.div
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.4, type: "spring" }}
                                            className="flex flex-col items-center space-y-4"
                                        >
                                            {/* App Logo */}
                                            <AuthLogo />

                                            <div>
                                                <CardTitle className="text-xl sm:text-2xl font-bold">{title}</CardTitle>
                                                <CardDescription className="text-sm">{subtitle}</CardDescription>
                                            </div>
                                        </motion.div>
                                    </CardHeader>

                                    <CardContent className="space-y-6 px-6 pb-4">
                                        {children}
                                    </CardContent>

                                    {footerContent && (
                                        <CardFooter className="pt-4 pb-6 px-6">
                                            {footerContent}
                                        </CardFooter>
                                    )}
                                </Card>
                            </motion.div>

                            {/* Mobile Marketing Content - Hiển thị dưới form */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="lg:hidden space-y-4"
                            >
                                {marketingContent}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}