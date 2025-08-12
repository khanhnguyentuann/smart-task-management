"use client"

import React from "react"
import { motion } from "framer-motion"
import { useUser } from "@/features/layout"
import { useDashboardData } from "../hooks"
import { DashboardContentProps } from "../types/dashboard.types"
import { DashboardHeader } from "./DashboardHeader"
import { StatsCards } from "./widgets/StatsCards/StatsCards"
import { RecentActivities } from "./widgets/RecentActivities/RecentActivities"
import { QuickActions } from "./widgets/QuickActions/QuickActions"

export const Dashboard = React.memo(function Dashboard({ user, onNavigate }: DashboardContentProps) {
    const { user: currentUser } = useUser()
    const { stats, activities, loading } = useDashboardData()

    // Add null check for user
    if (!user) {
        return (
            <div className="flex flex-col h-full relative overflow-hidden">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-6xl mb-4">🤖</div>
                        <h2 className="text-2xl font-bold mb-2">Welcome to Smart Task</h2>
                        <p className="text-muted-foreground">Please log in to continue</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full relative overflow-hidden">
            {/* Floating Background Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute opacity-5 dark:opacity-10"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                        }}
                        animate={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            rotate: 360,
                        }}
                        transition={{
                            duration: 20 + Math.random() * 10,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                        }}
                    >
                        <div
                            className={`w-${8 + Math.floor(Math.random() * 16)} h-${8 + Math.floor(Math.random() * 16)} 
                ${Math.random() > 0.5 ? "rounded-full" : "rounded-lg"} 
                bg-gradient-to-br from-blue-400 to-purple-400`}
                        />
                    </motion.div>
                ))}
            </div>

            <DashboardHeader user={user} />

            <div className="flex-1 overflow-auto p-6 relative z-10">
                <div className="space-y-8">
                    {/* Overview Cards */}
                    <StatsCards stats={stats} loading={loading} />

                    <div className="grid gap-8 lg:grid-cols-2">
                        {/* Recent Activities */}
                        <RecentActivities activities={activities} loading={loading} />

                        {/* Quick Actions */}
                        <QuickActions onNavigate={onNavigate} />
                    </div>
                </div>
            </div>
        </div>
    )
})
