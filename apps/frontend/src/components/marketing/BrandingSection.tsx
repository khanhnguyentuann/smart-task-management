"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

interface BrandingSectionProps {
    title?: string
    subtitle?: string
    description?: string
    gradientFrom?: string
    gradientTo?: string
}

export function BrandingSection({
    title = "Smart Task",
    subtitle = "Quản lý công việc thông minh",
    description = "Nền tảng quản lý dự án hiện đại với AI, giúp team của bạn làm việc hiệu quả hơn mỗi ngày.",
    gradientFrom = "from-blue-600",
    gradientTo = "to-purple-600"
}: BrandingSectionProps) {
    return (
        <div className="space-y-4">
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="flex items-center gap-3"
            >
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
                    className={`h-12 w-12 rounded-full bg-gradient-to-br ${gradientFrom} via-purple-500 ${gradientTo} flex items-center justify-center text-white shadow-xl`}
                >
                    <Sparkles className="h-6 w-6" />
                </motion.div>
                <div>
                    <h1 className={`text-2xl font-bold bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent`}>
                        {title}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {subtitle}
                    </p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {description}
                </h2>
            </motion.div>
        </div>
    )
}