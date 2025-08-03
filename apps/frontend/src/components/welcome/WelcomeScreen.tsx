"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Users, CheckSquare, BarChart3 } from "lucide-react"
import { AppLogo } from "@/components/common/AppLogo"

interface WelcomeScreenProps {
    onGetStarted: () => void
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
    const features = [
        {
            icon: CheckSquare,
            title: "Smart Task Management",
            description: "AI-powered task organization with intelligent prioritization",
        },
        {
            icon: Users,
            title: "Team Collaboration",
            description: "Seamless teamwork with real-time updates and notifications",
        },
        {
            icon: BarChart3,
            title: "Progress Tracking",
            description: "Visual analytics and insights to boost productivity",
        },
    ]

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-8"
                >
                    {/* Logo and Title */}
                    <div className="space-y-4">
                        <motion.div
                            animate={{
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: "reverse",
                            }}
                            className="inline-block"
                        >
                            <div className="flex items-center justify-center gap-3 text-6xl font-bold text-blue-600">
                                <AppLogo size="xl" variant="icon-only" className="text-blue-600 bg-transparent shadow-none" />
                                <span>Smart Task</span>
                            </div>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-xl text-muted-foreground max-w-2xl mx-auto"
                        >
                            Transform your productivity with AI-powered task management. Organize, collaborate, and achieve more with
                            your team.
                        </motion.p>
                    </div>

                    {/* Features */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="grid md:grid-cols-3 gap-8 my-12"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 + index * 0.2 }}
                                className="space-y-4"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="inline-block p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full"
                                >
                                    <feature.icon className="h-8 w-8 text-blue-600" />
                                </motion.div>
                                <h3 className="text-lg font-semibold">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2, type: "spring" }}
                    >
                        <Button
                            onClick={onGetStarted}
                            size="lg"
                            className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <AppLogo size="sm" variant="icon-only" className="mr-2 bg-transparent shadow-none" />
                            Get Started
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}