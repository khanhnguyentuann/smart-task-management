"use client"

import { useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"

interface DashboardLayoutProps {
    children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen bg-background">
            <Navbar
                onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
            />
            <div className="flex h-[calc(100vh-4rem)]">
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
                <main className="flex-1 overflow-y-auto">
                    <div className="container mx-auto p-4 lg:p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}