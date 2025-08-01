"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BrandingSection } from "@/components/marketing/branding-section"

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
            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
                    {/* Left Side - Marketing */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <BrandingSection {...brandingProps} />
                        {marketingContent}
                    </motion.div>

                    {/* Right Side - Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex justify-center lg:justify-end"
                    >
                        <Card className="w-full max-w-md rounded-2xl shadow-2xl border-0 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
                            <CardHeader className="space-y-3 text-center pt-8 pb-6">
                                <motion.div
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.4, type: "spring" }}
                                >
                                    <CardTitle className="text-2xl font-bold">{title}</CardTitle>
                                    <CardDescription>{subtitle}</CardDescription>
                                </motion.div>
                            </CardHeader>

                            <CardContent className="space-y-6 px-8 pb-6">
                                {children}
                            </CardContent>

                            {footerContent && (
                                <CardFooter className="pt-4 pb-8 px-8">
                                    {footerContent}
                                </CardFooter>
                            )}
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}