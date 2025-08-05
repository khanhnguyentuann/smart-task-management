"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useState, useMemo, useCallback } from "react"
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

    // Memoize expensive calculations
    const userFullName = useMemo(() =>
        getFullName(user.firstName, user.lastName, user.email),
        [user.firstName, user.lastName, user.email]
    )

    const userInitials = useMemo(() =>
        getUserInitials(user.firstName, user.lastName, user.email),
        [user.firstName, user.lastName, user.email]
    )

    const userRole = useMemo(() =>
        user.role === 'ADMIN' ? 'Admin' : 'Member',
        [user.role]
    )

    const handleLogout = useCallback(() => {
        authService.logout()
        router.push(ROUTES.LOGIN)
    }, [router])

    const toggleTheme = useCallback(() => {
        setTheme(theme === "dark" ? "light" : "dark")
    }, [theme, setTheme])

    if (variant === "compact") {
        return (
            <div className="flex items-center gap-3 p-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={userFullName} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                        {userInitials}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                        {userFullName}
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
                        className="flex-1 justify-start gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-105 min-w-0"
                    >
                        <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage src={user.avatar} alt={userFullName} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-medium">
                                {userInitials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start flex-1 min-w-0 max-w-[140px]">
                            <span className="text-sm font-medium text-sidebar-foreground truncate w-full">
                                {userFullName}
                            </span>
                            <div className="flex items-center gap-2 mt-1 w-full">
                                <span className="text-xs bg-sidebar-accent text-sidebar-accent-foreground px-2 py-0.5 rounded-full flex-shrink-0">
                                    {userRole}
                                </span>
                                <span className="text-xs text-sidebar-foreground/60 truncate">
                                    Engineering
                                </span>
                            </div>
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{userFullName}</p>
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
                    <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle Button */}
            {mounted && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTheme}
                    className={`theme-toggle-button h-8 w-8 p-0 rounded-lg shadow-sm transition-all duration-200 hover:scale-105 ${
                        theme === "light" 
                            ? "bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600" 
                            : "bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                    }`}
                >
                    {theme === "light" ? (
                        <Sun className="h-4 w-4 text-white" />
                    ) : (
                        <Moon className="h-4 w-4 text-white" />
                    )}
                </Button>
            )}
        </div>
    )
}