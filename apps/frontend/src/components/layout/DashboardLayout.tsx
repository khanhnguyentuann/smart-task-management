"use client"

import { SidebarProvider } from "@/components/ui/Sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { Navbar } from "@/components/layout/Navbar"

interface DashboardLayoutProps {
    children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <AppSidebar />
                <div className="flex-1 flex flex-col">
                    <Navbar />
                    <main className="flex-1 overflow-y-auto bg-background">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}