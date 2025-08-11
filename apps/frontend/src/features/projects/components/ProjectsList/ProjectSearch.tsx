"use client"

import { Input } from "@/shared/components/ui/input"
import { Search, Loader2 } from "lucide-react"

interface ProjectSearchProps {
    searchQuery: string
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    isSearching?: boolean
}

export function ProjectSearch({ searchQuery, onSearchChange, isSearching = false }: ProjectSearchProps) {
    return (
        <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={onSearchChange}
                className="pl-10"
            />
            {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
        </div>
    )
}
