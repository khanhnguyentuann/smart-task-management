"use client"

import { useRouter } from "next/navigation"
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
import { User, Settings, HelpCircle, LogOut } from "lucide-react"
import { authService } from "@/services/auth.service"
import { User as UserType } from "@/types/auth"
import { getUserInitials, getFullName } from "@/utils/string"

interface UserMenuProps {
    user: UserType
}

export function UserMenu({ user }: UserMenuProps) {
    const router = useRouter()

    const handleLogout = () => {
        authService.logout()
        router.push("/login")
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 p-2"
                >
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={getFullName(user)} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
                            {getUserInitials(user.email)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start flex-1 text-sm">
                        <span className="font-medium">{getFullName(user)}</span>
                        <span className="text-xs text-muted-foreground">{user.role}</span>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{getFullName(user)}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")}>
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
    )
}