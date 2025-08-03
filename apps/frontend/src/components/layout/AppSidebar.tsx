"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    FolderKanban,
    CheckSquare,
    Users,
    Calendar,
    BarChart3
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
import { motion } from "framer-motion"
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
    const [user, setUser] = useState<UserType | null>(null)

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

    const handleNavigate = (href: string) => {
        window.location.href = href
    }

    return (
        <Sidebar>
            <SidebarHeader className="border-b p-4">
                <motion.div
                    className="flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <NavbarLogo />
                </motion.div>
            </SidebarHeader>

            <SidebarContent className="p-4">
                <SidebarMenu>
                    {menuItems.map((item, index) => (
                        <SidebarMenuItem key={item.href}>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <SidebarMenuButton
                                    onClick={() => handleNavigate(item.href)}
                                    isActive={pathname === item.href}
                                >
                                    <motion.div
                                        whileHover={{ rotate: 10, scale: 1.1 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <item.icon className="h-4 w-4" />
                                    </motion.div>
                                    <span>{item.title}</span>
                                </SidebarMenuButton>
                            </motion.div>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="border-t p-4">
                {user && <UserMenu user={user} />}
            </SidebarFooter>
        </Sidebar>
    )
}