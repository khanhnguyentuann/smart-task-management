"use client"

import React from "react"
import { motion } from "framer-motion"
import { TrendingUp } from "lucide-react"
import { CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Progress } from "@/shared/components/ui/progress"
import { GlassmorphismCard } from "@/shared/components/ui/glassmorphism-card"
import { StatCard as StatCardType } from "../../../types/dashboard.types"

interface StatCardProps {
    stat: StatCardType
    index: number
    loading?: boolean
}

export const StatCard = React.memo(function StatCard({ stat, index, loading = false }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group"
        >
            <GlassmorphismCard className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Gradient Background */}
                <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`}
                />

                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                    <motion.div
                        whileHover={{ rotate: 15, scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className={`p-2 rounded-full bg-gradient-to-br ${stat.color} shadow-lg`}
                    >
                        <stat.icon className="h-4 w-4 text-white" />
                    </motion.div>
                </CardHeader>

                <CardContent className="relative z-10">
                    <div className="space-y-3">
                        <motion.div
                            className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                        >
                            {loading ? (
                                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            ) : (
                                stat.value
                            )}
                        </motion.div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">{stat.change}</span>
                                {stat.trend !== "neutral" && (
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                        className={stat.trend === "up" ? "text-green-500" : "text-red-500"}
                                    >
                                        <TrendingUp className={`h-3 w-3 ${stat.trend === "down" ? "rotate-180" : ""}`} />
                                    </motion.div>
                                )}
                            </div>

                            <div className="space-y-1">
                                <Progress value={stat.progress} className="h-2 bg-gray-200 dark:bg-gray-700" />
                                <div className="text-xs text-muted-foreground text-right">{Math.round(stat.progress)}% of target</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </GlassmorphismCard>
        </motion.div>
    )
})
