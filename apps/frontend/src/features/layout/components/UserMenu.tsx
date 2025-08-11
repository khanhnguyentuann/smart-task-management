"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { User, Bell, Settings, HelpCircle, LogOut } from "lucide-react"
import { motion } from "framer-motion"
import { EnhancedThemeToggle } from "@/shared/components/ui/enhanced-theme-toggle"
import { useRouter } from "next/navigation"

interface UserMenuProps {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    avatar?: string
    department?: string
  } | null
  onLogout: () => void
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleNavigate = (page: string) => {
    router.push(`/${page}`)
    setIsOpen(false) // Close dropdown after navigation
  }

  // If user is null, don't render the menu
  if (!user) {
    return null
  }

  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email || 'User'
  const getInitials = () => (displayName?.match(/\b\w/g)?.join('').slice(0, 2) || 'U').toUpperCase()

  return (
    <div className="flex items-center justify-between w-full gap-2">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <motion.button
            className="flex items-center gap-3 text-left hover:bg-muted/50 rounded-lg p-2 transition-colors flex-1 min-w-0"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Avatar className="h-10 w-10 ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all">
                <AvatarImage src={user.avatar && user.avatar.startsWith('data:image') ? user.avatar : (user.avatar || '/default-avatar.svg')} alt={displayName} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate max-w-[180px] md:max-w-[220px]">
                {displayName}
              </p>
              <div className="flex items-center gap-2 min-w-0">
                {user.email && <span className="text-xs text-muted-foreground truncate">{user.email}</span>}
              </div>
            </div>
          </motion.button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-56">
          <div className="flex items-center gap-3 p-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar && user.avatar.startsWith('data:image') ? user.avatar : (user.avatar || '/default-avatar.svg')} alt={displayName} />
              <AvatarFallback>
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{displayName}</p>
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
