"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
    LayoutDashboard,
    FolderKanban,
    CheckSquare,
    Users,
    Calendar,
    BarChart3,
    Loader2
} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
} from "@/components/ui/Sidebar"
import { UserMenu } from "@/components/layout/UserMenu"
import { authService } from "@/services/auth.service"
import { User as UserType } from "@/types/auth"
import { NavbarLogo } from "@/components/common/AppLogo"

const menuItems = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
    },
    {
        title: "Projects",
        icon: FolderKanban,
        href: "/projects",
    },
    {
        title: "Tasks",
        icon: CheckSquare,
        href: "/tasks",
    },
    {
        title: "Team",
        icon: Users,
        href: "/team",
    },
    {
        title: "Calendar",
        icon: Calendar,
        href: "/calendar",
    },
    {
        title: "Reports",
        icon: BarChart3,
        href: "/reports",
    },
]

export function AppSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [user, setUser] = useState<UserType | null>(null)
    const [isNavigating, setIsNavigating] = useState(false)

    useEffect(() => {
        fetchUser()
    }, [])

    const fetchUser = async () => {
        try {
            const response = await authService.getMe()
            setUser(response.user)
        } catch (error) {
            console.error('Failed to fetch user:', error)
        }
    }

    const handleNavigate = async (href: string) => {
        if (pathname === href) return // Don't navigate if already on the page
        
        setIsNavigating(true)
        try {
            await router.push(href)
        } finally {
            // Reset loading state after a short delay to show the transition
            setTimeout(() => setIsNavigating(false), 300)
        }
    }

    return (
        <Sidebar>
            <div className="flex flex-col h-full w-full">
                <SidebarHeader className="border-b p-4">
                    <div className="flex items-center gap-2">
                        <NavbarLogo />
                    </div>
                </SidebarHeader>

                <SidebarContent className="p-4 flex-1">
                    <SidebarMenu>
                        {menuItems.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    onClick={() => handleNavigate(item.href)}
                                    isActive={pathname === item.href}
                                    disabled={isNavigating}
                                >
                                    {isNavigating && pathname === item.href ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <item.icon className="h-4 w-4" />
                                    )}
                                    <span>{item.title}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>

                <SidebarFooter className="border-t p-4">
                    {user && <UserMenu user={user} />}
                </SidebarFooter>
            </div>
        </Sidebar>
    )
}