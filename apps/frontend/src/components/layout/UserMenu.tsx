"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import { User, Settings, HelpCircle, LogOut, Sun, Moon } from "lucide-react"
import { authService } from "@/services/auth.service"
import { User as UserType } from "@/types/auth"
import { getUserInitials, getFullName } from "@/utils/string"
import { ROUTES } from "@/constants/routes"

interface UserMenuProps {
    user: UserType
    variant?: "default" | "compact"
}

export function UserMenu({ user, variant = "default" }: UserMenuProps) {
    const router = useRouter()
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleLogout = () => {
        authService.logout()
        router.push(ROUTES.LOGIN)
    }

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    if (variant === "compact") {
        return (
            <div className="flex items-center gap-3 p-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={getFullName(user.firstName, user.lastName, user.email)} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                        {getUserInitials(user.firstName, user.lastName, user.email)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                        {getFullName(user.firstName, user.lastName, user.email)}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                                        <Button
                        variant="ghost"
                        className="flex-1 justify-start gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors min-w-0"
                    >
                        <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage src={user.avatar} alt={getFullName(user.firstName, user.lastName, user.email)} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-medium">
                                {getUserInitials(user.firstName, user.lastName, user.email)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start flex-1 min-w-0 max-w-[140px]">
                            <span className="text-sm font-medium text-gray-900 dark:text-white truncate w-full">
                                {getFullName(user.firstName, user.lastName, user.email)}
                            </span>
                            <div className="flex items-center gap-2 mt-1 w-full">
                                <span className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white px-2 py-0.5 rounded-full flex-shrink-0">
                                    {user.role === 'ADMIN' ? 'Admin' : 'Member'}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    Engineering
                                </span>
                            </div>
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{getFullName(user.firstName, user.lastName, user.email)}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {user.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push(ROUTES.PROFILE)}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(ROUTES.SETTINGS)}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <HelpCircle className="mr-2 h-4 w-4" />
                        <span>Help & Support</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            
                        <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className={cn(
                    "w-8 h-8 rounded-full transition-all duration-200 flex-shrink-0 shadow-sm",
                    mounted && theme === "light" 
                        ? "bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-yellow-200/50" 
                        : "bg-gradient-to-br from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 shadow-blue-200/50 dark:shadow-blue-900/30"
                )}
            >
                {mounted && theme === "light" ? (
                    <Sun className="h-4 w-4 text-white" />
                ) : (
                    <Moon className="h-4 w-4 text-white" />
                )}
            </Button>
        </div>
    )
}