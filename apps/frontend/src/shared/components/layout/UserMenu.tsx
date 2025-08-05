"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { EnhancedThemeToggle } from "@/shared/components/ui/enhanced-theme-toggle"
import { motion } from "framer-motion"
import { User, Settings, LogOut, Bell, HelpCircle } from "lucide-react"

interface UserMenuProps {
  user: {
    id: string
    name: string
    email: string
    role: "Admin" | "Member"
    avatar: string
    department?: string
  }
  onNavigate: (page: string) => void
  onLogout: () => void
}

export function UserMenu({ user, onNavigate, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleNavigate = (page: string) => {
    onNavigate(page)
    setIsOpen(false) // Close dropdown after navigation
  }

  return (
    <div className="flex items-center justify-between w-full">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <motion.button
            className="flex items-center gap-3 w-full text-left hover:bg-muted/50 rounded-lg p-2 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Avatar className="h-10 w-10 ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <div className="flex items-center gap-2">
                <Badge variant={user.role === "Admin" ? "default" : "secondary"} className="text-xs">
                  {user.role}
                </Badge>
                {user.department && <span className="text-xs text-muted-foreground truncate">{user.department}</span>}
              </div>
            </div>
          </motion.button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-56">
          <div className="flex items-center gap-3 p-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => handleNavigate("profile")} className="cursor-pointer">
            <User className="h-4 w-4 mr-2" />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleNavigate("notifications")} className="cursor-pointer">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleNavigate("settings")} className="cursor-pointer">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleNavigate("help-support")} className="cursor-pointer">
            <HelpCircle className="h-4 w-4 mr-2" />
            Help & Support
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-600 focus:text-red-600">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EnhancedThemeToggle />
    </div>
  )
} 