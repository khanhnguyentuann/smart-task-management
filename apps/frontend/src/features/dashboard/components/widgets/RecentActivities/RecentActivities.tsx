"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Activity } from "lucide-react"
import { CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card/Card"
import { GlassmorphismCard } from "@/shared/components/ui/glassmorphism-card"
import { Activity as ActivityType } from "../../../types/dashboard.types"
import { ActivityItem } from "./ActivityItem"
import { EmptyState } from "./EmptyState"

interface RecentActivitiesProps {
    activities: ActivityType[]
    loading: boolean
}

export function RecentActivities({ activities, loading }: RecentActivitiesProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <GlassmorphismCard className="shadow-xl border-0">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3">
                        <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full shadow-lg"
                        >
                            <Activity className="h-5 w-5 text-white" />
                        </motion.div>
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Recent Activities
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {loading ? (
                            // Loading skeleton for activities
                            [...Array(4)].map((_, index) => (
                                <div key={index} className="flex items-start gap-4 p-3 rounded-lg">
                                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
                                    </div>
                                </div>
                            ))
                        ) : activities.length > 0 ? (
                            <AnimatePresence>
                                {activities.map((activity, index) => (
                                    <ActivityItem 
                                        key={activity.id} 
                                        activity={activity} 
                                        index={index} 
                                    />
                                ))}
                            </AnimatePresence>
                        ) : (
                            <EmptyState />
                        )}
                    </div>
                </CardContent>
            </GlassmorphismCard>
        </motion.div>
    )
}
