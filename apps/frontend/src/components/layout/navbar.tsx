"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { authService } from "@/services/auth.service"
import { User } from "@/types/auth"
import { Menu, X, User as UserIcon, LogOut, Settings, Bell, Search } from "lucide-react"

interface NavbarProps {
    onMenuClick: () => void
    isSidebarOpen: boolean
}

export function Navbar({ onMenuClick, isSidebarOpen }: NavbarProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    useEffect(() => {
        fetchUser()
    }, [pathname])

    const fetchUser = async () => {
        try {
            setIsLoading(true)
            const response = await authService.getMe()
            setUser(response.user)
        } catch (error) {
            console.error('Failed to fetch user:', error)
            // User not authenticated
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true)
            authService.logout()
            router.push("/login")
        } catch (error) {
            console.error("Logout failed:", error)
        } finally {
            setIsLoggingOut(false)
        }
    }

    const getUserInitials = (email: string) => {
        return email.substring(0, 2).toUpperCase()
    }

    if (isLoading) {
        return (
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-16 items-center px-4 lg:px-6">
                    <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
                    <div className="ml-4 h-4 w-32 animate-pulse rounded bg-muted" />
                    <div className="ml-auto h-8 w-8 animate-pulse rounded-full bg-muted" />
                </div>
            </header>
        )
    }

    if (!user) return null

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-4 lg:px-6">
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden transition-all duration-200 hover:bg-accent/50"
                    onClick={onMenuClick}
                >
                    {isSidebarOpen ? (
                        <X className="h-5 w-5 transition-transform duration-200" />
                    ) : (
                        <Menu className="h-5 w-5 transition-transform duration-200" />
                    )}
                </Button>

                <div className="flex items-center gap-2 lg:gap-4">
                    <Link href="/dashboard" className="flex items-center gap-2 font-semibold group">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:scale-105">
                            T
                        </div>
                        <span className="hidden sm:inline-block transition-colors duration-200 group-hover:text-primary">
                            Smart Task
                        </span>
                    </Link>
                </div>

                <div className="ml-auto flex items-center gap-2">
                    {/* Search Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hidden md:flex transition-all duration-200 hover:bg-accent/50"
                    >
                        <Search className="h-4 w-4" />
                    </Button>

                    {/* Notifications */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative transition-all duration-200 hover:bg-accent/50"
                    >
                        <Bell className="h-4 w-4" />
                        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                            3
                        </span>
                    </Button>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="relative h-9 w-9 rounded-full transition-all duration-200 hover:bg-accent/50 hover:scale-105"
                            >
                                <Avatar className="h-9 w-9 ring-2 ring-transparent hover:ring-primary/20 transition-all duration-200">
                                    <AvatarImage src={user.avatar} alt={user.email} />
                                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
                                        {getUserInitials(user.email)}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user.email}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user.role}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/profile" className="cursor-pointer transition-colors duration-200 hover:bg-accent/50">
                                    <UserIcon className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/settings" className="cursor-pointer transition-colors duration-200 hover:bg-accent/50">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="cursor-pointer text-destructive focus:text-destructive transition-colors duration-200 hover:bg-destructive/10"
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}