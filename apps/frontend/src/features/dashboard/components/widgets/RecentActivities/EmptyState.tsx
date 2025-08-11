"use client"

export function EmptyState() {
    return (
        <div className="text-center py-8">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-muted-foreground">No recent activities yet</p>
            <p className="text-sm text-muted-foreground">Start creating projects and tasks to see activity here</p>
        </div>
    )
}
