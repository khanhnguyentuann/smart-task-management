"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { CheckSquare, Users, Settings } from "lucide-react"

interface ProjectTabsProps {
    children: React.ReactNode
}

export function ProjectTabs({ children }: ProjectTabsProps) {
    return (
        <Tabs defaultValue="tasks" className="space-y-4">
            <TabsList>
                <TabsTrigger value="tasks" className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4" />
                    Tasks
                </TabsTrigger>
                <TabsTrigger value="members" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Members
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                </TabsTrigger>
            </TabsList>
            {children}
        </Tabs>
    )
}