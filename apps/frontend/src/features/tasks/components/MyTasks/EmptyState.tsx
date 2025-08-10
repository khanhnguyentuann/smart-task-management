"use client"

interface EmptyStateProps {
    searchQuery: string
    statusFilter: string
    priorityFilter: string
}

export function EmptyState({ searchQuery, statusFilter, priorityFilter }: EmptyStateProps) {
    return (
        <div className="text-center py-12">
            <div className="text-muted-foreground">
                {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
                    ? "No tasks found matching your filters."
                    : "No tasks assigned to you yet."}
            </div>
        </div>
    )
}
