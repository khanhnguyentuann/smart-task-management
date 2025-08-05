"use client"

import { SidebarProvider, useSidebar } from "@/components/ui/Sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { DashboardHeader } from "@/components/layout/DashboardHeader"
import { AnimatedBackground } from "@/components/ui/AnimatedBackground"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useScrollLock } from "@/hooks/useScrollLock"

interface DashboardLayoutProps {
    children: React.ReactNode
}

function DashboardContent({ children }: DashboardLayoutProps) {
    const { open, isMobile } = useSidebar()
    const pathname = usePathname()
    const [isTransitioning, setIsTransitioning] = useState(false)

    // Lock scroll during transitions
    useScrollLock(isTransitioning)

    useEffect(() => {
        setIsTransitioning(true)
        const timer = setTimeout(() => setIsTransitioning(false), 400) // Reduced to match duration
        return () => clearTimeout(timer)
    }, [pathname])

    return (
        <>
            <AppSidebar />

            <motion.div
                className={`flex-1 flex flex-col min-h-screen overflow-hidden gpu-accelerated ${
                    isTransitioning ? 'transitioning' : ''
                }`}
                animate={{
                    marginLeft: isMobile ? 0 : open ? 280 : 0,
                }}
                transition={{ 
                    duration: 0.4, 
                    ease: [0.4, 0.0, 0.2, 1],
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        className="flex-1 flex flex-col min-h-screen layout-stable"
                        initial={{ opacity: 0, x: 60, scale: 0.98 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -60, scale: 0.98 }}
                        transition={{ 
                            duration: 0.4, 
                            ease: [0.4, 0.0, 0.2, 1],
                            opacity: { duration: 0.4 },
                            scale: { duration: 0.4 }
                        }}
                        onAnimationStart={() => setIsTransitioning(true)}
                        onAnimationComplete={() => setIsTransitioning(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            <DashboardHeader />
                        </motion.div>
                        
                        <main className="flex-1 overflow-hidden bg-transparent">
                            <motion.div 
                                className="h-full overflow-y-auto page-content"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                            >
                                <div className="p-6 bg-background/80 backdrop-blur-sm rounded-lg">
                                    {children}
                                </div>
                            </motion.div>
                        </main>
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </>
    )
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <SidebarProvider defaultOpen={true}>
            <AnimatedBackground />
            <div className="flex min-h-screen bg-transparent overflow-hidden">
                <DashboardContent>{children}</DashboardContent>
            </div>
        </SidebarProvider>
    )
}