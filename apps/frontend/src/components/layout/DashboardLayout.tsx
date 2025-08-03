"use client"

import { SidebarProvider, useSidebar } from "@/components/ui/Sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { DashboardHeader } from "@/components/layout/DashboardHeader"
import { motion } from "framer-motion"

interface DashboardLayoutProps {
    children: React.ReactNode
}

function DashboardContent({ children }: DashboardLayoutProps) {
    const { open, isMobile } = useSidebar()

    return (
        <>
            <AppSidebar />

            <motion.div
                className="flex-1 flex flex-col min-h-screen"
                animate={{
                    marginLeft: isMobile ? 0 : open ? 280 : 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <DashboardHeader />
                <main className="flex-1 overflow-y-auto bg-background">
                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </motion.div>
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