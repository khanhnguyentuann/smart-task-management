"use client"

import { SidebarProvider, useSidebar } from "@/components/ui/Sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { DashboardHeader } from "@/components/layout/DashboardHeader"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"

interface DashboardLayoutProps {
    children: React.ReactNode
}

function DashboardContent({ children }: DashboardLayoutProps) {
    const { open, isMobile } = useSidebar()
    const pathname = usePathname()

    return (
        <>
            <AppSidebar />

            <div
                className="flex-1 flex flex-col min-h-screen"
                style={{
                    marginLeft: isMobile ? 0 : open ? 280 : 0,
                    transition: 'margin-left 0.3s ease-in-out'
                }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        className="flex-1 flex flex-col min-h-screen"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <DashboardHeader />
                        <main className="flex-1 overflow-y-auto bg-background">
                            <div className="p-6">
                                {children}
                            </div>
                        </main>
                    </motion.div>
                </AnimatePresence>
            </div>
        </>
    )
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <SidebarProvider defaultOpen={true}>
            <div className="flex min-h-screen bg-background">
                <DashboardContent>{children}</DashboardContent>
            </div>
        </SidebarProvider>
    )
}