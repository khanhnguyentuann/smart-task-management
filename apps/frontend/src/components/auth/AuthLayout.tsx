"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { BrandingSection } from "@/components/marketing/BrandingSection"
import { Sparkles } from "lucide-react"

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
        <div className={`min-h-screen bg-gradient-to-br ${backgroundGradient}`}>
            <div className="container mx-auto px-4 py-6 md:py-8">
                {/* Mobile & Tablet Branding */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="xl:hidden mb-8 md:mb-12 text-center"
                >
                    <BrandingSection {...brandingProps} />
                </motion.div>

                <div className="grid xl:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start xl:items-center min-h-[calc(100vh-12rem)] xl:min-h-[calc(100vh-3rem)]">
                    {/* Left Side - Marketing (Desktop only) */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="hidden xl:block space-y-8"
                    >
                        <BrandingSection {...brandingProps} />
                        {marketingContent}
                    </motion.div>

                    {/* Right Side - Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex justify-center xl:justify-end w-full"
                    >
                        <Card className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-md rounded-2xl shadow-2xl border-0 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
                            <CardHeader className="space-y-3 text-center pt-6 sm:pt-8 pb-4 sm:pb-6">
                                <motion.div
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.4, type: "spring" }}
                                    className="flex flex-col items-center space-y-4"
                                >
                                    {/* App Logo */}
                                    <motion.div
                                        animate={{
                                            rotate: [0, 10, -10, 0],
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            repeatType: "reverse"
                                        }}
                                        className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-blue-600 via-purple-500 to-purple-600 flex items-center justify-center text-white shadow-xl"
                                    >
                                        <Sparkles className="h-7 w-7 sm:h-8 sm:w-8" />
                                    </motion.div>

                                    <div>
                                        <CardTitle className="text-xl sm:text-2xl font-bold">{title}</CardTitle>
                                        <CardDescription className="text-sm sm:text-base">{subtitle}</CardDescription>
                                    </div>
                                </motion.div>
                            </CardHeader>

                            <CardContent className="space-y-6 px-6 sm:px-8 pb-4 sm:pb-6">
                                {children}
                            </CardContent>

                            {footerContent && (
                                <CardFooter className="pt-4 pb-6 sm:pb-8 px-6 sm:px-8">
                                    {footerContent}
                                </CardFooter>
                            )}
                        </Card>
                    </motion.div>
                </div>

                {/* Mobile & Tablet Marketing Content */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="xl:hidden mt-12 lg:mt-16 px-4"
                >
                    {marketingContent}
                </motion.div>
            </div>
        </div>
    )
}