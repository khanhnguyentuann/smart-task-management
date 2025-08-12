"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { SidebarTrigger } from "@/shared/components/ui"
import { getGreeting } from "../lib"
import { User } from "@/shared/lib"

interface DashboardHeaderProps {
    user: User | null
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
    const [greeting, setGreeting] = useState("")
    const [timeEmoji, setTimeEmoji] = useState("")

    // Update greeting based on time
    useEffect(() => {
        const updateGreeting = () => {
            const firstName = user?.firstName || "User"
            const { message, emoji } = getGreeting(firstName)
            setGreeting(message)
            setTimeEmoji(emoji)
        }

        if (user?.firstName) {
            updateGreeting()
            const interval = setInterval(updateGreeting, 60000) // Update every minute
            return () => clearInterval(interval)
        }
    }, [user?.firstName])

    return (
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative z-10">
            <div className="flex h-14 items-center gap-4 px-6">
                <SidebarTrigger />
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                >
                    <motion.span
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        className="text-2xl"
                    >
                        {timeEmoji}
                    </motion.span>
                    <div>
                        <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {greeting}
                        </h1>
                        <p className="text-sm text-muted-foreground">Ready to make today productive?</p>
                    </div>
                </motion.div>
            </div>
        </header>
    )
}
