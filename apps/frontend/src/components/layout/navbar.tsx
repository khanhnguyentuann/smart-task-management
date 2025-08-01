"use client"

import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { SidebarTrigger } from "@/components/ui/Sidebar"
import { Input } from "@/components/ui/Input"

export function Navbar() {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-4 gap-4">
                <SidebarTrigger />

                <div className="flex-1 flex items-center gap-4">
                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            className="pl-10 bg-muted/50"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative"
                    >
                        <Bell className="h-4 w-4" />
                        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                            3
                        </span>
                    </Button>
                </div>
            </div>
        </header>
    )
}