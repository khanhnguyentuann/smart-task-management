"use client"

import { motion } from "framer-motion"
import { Feature } from "@/data/features"

interface FeaturesGridProps {
    features: Feature[]
    delay?: number
    columns?: number
}

export function FeaturesGrid({ features, delay = 0.6, columns = 2 }: FeaturesGridProps) {
    const gridCols = columns === 2 ? "grid-cols-2" : "grid-cols-3"

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className={`grid ${gridCols} gap-6`}
        >
            {features.map((feature, index) => (
                <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
        </motion.div>
    )
}

interface FeatureCardProps {
    feature: Feature
    index: number
}

function FeatureCard({ feature, index }: FeatureCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 group"
        >
            <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="inline-flex p-2 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg mb-3 group-hover:shadow-lg transition-shadow"
            >
                <feature.icon className="h-5 w-5" />
            </motion.div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {feature.title}
            </h3>
            <p className="text-sm text-muted-foreground">
                {feature.description}
            </p>
        </motion.div>
    )
}