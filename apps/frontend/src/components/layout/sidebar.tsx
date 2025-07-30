"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    Home,
    FolderOpen,
    CheckSquare,
    Users,
    Calendar,
    BarChart3,
    Settings,
} from "lucide-react"

interface SidebarProps {
    isOpen: boolean
    onClose?: () => void
}

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Projects", href: "/projects", icon: FolderOpen },
    { name: "Tasks", href: "/tasks", icon: CheckSquare },
    { name: "Team", href: "/team", icon: Users },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "Reports", href: "/reports", icon: BarChart3 },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname()

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 transform border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ease-in-out lg:static lg:transform-none",
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                <nav className="flex h-full flex-col gap-2 p-4">
                    <div className="flex-1 space-y-1">
                        {navigation.map((item, index) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={onClose}
                                    className={cn(
                                        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground relative overflow-hidden",
                                        isActive
                                            ? "bg-primary/10 text-primary border-r-2 border-primary shadow-sm"
                                            : "text-muted-foreground hover:translate-x-1"
                                    )}
                                    style={{
                                        animationDelay: `${index * 50}ms`
                                    }}
                                >
                                    <item.icon className={cn(
                                        "h-4 w-4 transition-all duration-200",
                                        isActive ? "text-primary" : "group-hover:scale-110"
                                    )} />
                                    <span className="transition-all duration-200">
                                        {item.name}
                                    </span>
                                    {isActive && (
                                        <div className="absolute inset-0 bg-primary/5 rounded-lg animate-in fade-in duration-200" />
                                    )}
                                </Link>
                            )
                        })}
                    </div>

                    <div className="border-t pt-4">
                        <Link
                            href="/settings"
                            onClick={onClose}
                            className={cn(
                                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground",
                                pathname === "/settings"
                                    ? "bg-primary/10 text-primary border-r-2 border-primary shadow-sm"
                                    : "text-muted-foreground hover:translate-x-1"
                            )}
                        >
                            <Settings className={cn(
                                "h-4 w-4 transition-all duration-200",
                                pathname === "/settings" ? "text-primary" : "group-hover:scale-110"
                            )} />
                            <span>Settings</span>
                        </Link>
                    </div>
                </nav>
            </aside>
        </>
    )
}