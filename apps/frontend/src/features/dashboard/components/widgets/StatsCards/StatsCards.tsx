"use client"

import { motion } from "framer-motion"
import { DashboardService } from "../../../services"
import { DashboardStats } from "../../../types/dashboard.types"
import { StatCard } from "./StatCard"

interface StatsCardsProps {
    stats: DashboardStats
    loading: boolean
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
    const statsData = DashboardService.getStatCards(stats)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
            {statsData.map((stat, index) => (
                <StatCard 
                    key={stat.title} 
                    stat={stat} 
                    index={index} 
                    loading={loading} 
                />
            ))}
        </motion.div>
    )
}
