"use client"

import { motion } from "framer-motion"
import { Plus, Eye } from "lucide-react"
import { CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { GlassmorphismCard } from "@/shared/components/ui/glassmorphism-card"
import { EnhancedButton } from "@/shared/components/ui/enhanced-button"

interface QuickActionsProps {
    onNavigate: (page: string) => void
}

export function QuickActions({ onNavigate }: QuickActionsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
        >
            <GlassmorphismCard className="shadow-xl border-0">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <motion.div
                            whileHover={{ rotate: 180 }}
                            transition={{ duration: 0.3 }}
                            className="p-2 bg-gradient-to-br from-green-500 to-teal-500 rounded-full shadow-lg"
                        >
                            <Plus className="h-5 w-5 text-white" />
                        </motion.div>
                        <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                            Quick Actions
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <EnhancedButton
                            onClick={() => onNavigate("projects")}
                            className="w-full justify-start bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-lg"
                            size="lg"
                        >
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            >
                                <Plus className="h-5 w-5 mr-3" />
                            </motion.div>
                            Create New Project
                        </EnhancedButton>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <EnhancedButton
                            onClick={() => onNavigate("my-tasks")}
                            variant="outline"
                            className="w-full justify-start border-2 border-green-200 hover:border-green-300 hover:bg-green-50 dark:border-green-800 dark:hover:border-green-700 dark:hover:bg-green-950/20"
                            size="lg"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            >
                                <Eye className="h-5 w-5 mr-3 text-green-600" />
                            </motion.div>
                            View All Tasks
                        </EnhancedButton>
                    </motion.div>
                </CardContent>
            </GlassmorphismCard>
        </motion.div>
    )
}
