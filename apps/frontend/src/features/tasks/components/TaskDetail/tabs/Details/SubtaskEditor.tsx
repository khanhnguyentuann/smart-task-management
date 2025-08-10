"use client"

import { Button } from "@/shared/components/ui/button/Button"
import { Input } from "@/shared/components/ui/input"
import { Plus } from 'lucide-react'

interface SubtaskEditorProps {
    newSubtask: string
    setNewSubtask: (value: string) => void
    onAddSubtask: () => void
    placeholder?: string
}

export function SubtaskEditor({
    newSubtask,
    setNewSubtask,
    onAddSubtask,
    placeholder = "Add subtask..."
}: SubtaskEditorProps) {
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && newSubtask.trim()) {
            onAddSubtask()
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Input
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder={placeholder}
                className="flex-1"
                onKeyPress={handleKeyPress}
            />
            <Button
                onClick={onAddSubtask}
                size="sm"
                disabled={!newSubtask.trim()}
            >
                <Plus className="h-4 w-4" />
            </Button>
        </div>
    )
}
