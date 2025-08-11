"use client"

import { Button, buttonVariants } from "@/shared/components/ui/button"
import { CheckSquare, Square, X } from 'lucide-react'
import { motion } from "framer-motion"

interface SubtaskItemProps {
    subtask: {
        id: string
        title: string
        completed: boolean
    }
    onToggle: (subtaskId: string) => void
    onDelete?: (subtaskId: string) => void
    isEditing?: boolean
}

export function SubtaskItem({ subtask, onToggle, onDelete, isEditing }: SubtaskItemProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors group"
        >
            <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0"
                onClick={() => onToggle(subtask.id)}
            >
                {subtask.completed ? (
                    <CheckSquare className="h-4 w-4 text-green-600" />
                ) : (
                    <Square className="h-4 w-4" />
                )}
            </Button>

            <span className={`text-sm flex-1 ${subtask.completed ? "line-through text-muted-foreground" : ""}`}>
                {subtask.title}
            </span>

            {isEditing && onDelete && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onDelete(subtask.id)}
                >
                    <X className="h-3 w-3 text-red-600" />
                </Button>
            )}
        </motion.div>
    )
}
