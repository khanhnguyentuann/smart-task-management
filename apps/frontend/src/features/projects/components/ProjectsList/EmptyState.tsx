"use client"

import { Button, buttonVariants } from "@/shared/components/ui/button"
import { Plus } from "lucide-react"

interface EmptyStateProps {
    searchQuery: string
    onCreateProject: () => void
}

export function EmptyState({ searchQuery, onCreateProject }: EmptyStateProps) {
    return (
        <div className="text-center py-12">
            <div className="text-muted-foreground">
                {searchQuery ? "No projects found matching your search." : "No projects yet."}
            </div>
            {!searchQuery && (
                <Button className="mt-4" onClick={onCreateProject}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Project
                </Button>
            )}
        </div>
    )
}
