"use client"

import { LayoutDashboard, FolderKanban, CheckSquare, User } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/shared/components/ui/sidebar"
import { UserMenu } from "@/shared/components/layout/UserMenu"
import { motion } from "framer-motion"
import { useSidebar } from "@/shared/components/ui/sidebar"

interface AppSidebarProps {
  user: {
    id: string
    name: string
    email: string
    role: "Admin" | "Member"
    avatar: string
    department?: string
  }
  currentPage: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    key: "dashboard",
  },
  {
    title: "Projects",
    icon: FolderKanban,
    key: "projects",
  },
  {
    title: "My Tasks",
    icon: CheckSquare,
    key: "my-tasks",
  },
  {
    title: "Profile",
    icon: User,
    key: "profile",
  },
]

export function AppSidebar({ user, currentPage, onNavigate, onLogout }: AppSidebarProps) {
  const { setOpenMobile, isMobile } = useSidebar()

  const handleNavigate = (page: string) => {
    onNavigate(page)
    // Auto-close sidebar on mobile after navigation
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-4">
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center gap-2 text-xl font-bold text-blue-600">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <div className="text-2xl">🤖</div>
            </motion.div>
            Smart Task
          </div>
        </motion.div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarMenu>
          {menuItems.map((item, index) => (
            <SidebarMenuItem key={item.key}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <SidebarMenuButton
                  onClick={() => handleNavigate(item.key)}
                  isActive={currentPage === item.key}
                  className="w-full justify-start hover:scale-105 transition-transform"
                >
                  <motion.div whileHover={{ rotate: 10, scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
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
        <UserMenu user={user} onNavigate={handleNavigate} onLogout={onLogout} />
      </SidebarFooter>
    </Sidebar>
  )
} 