"use client"

import { Button } from "@/shared/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { Smile } from 'lucide-react'
import { REACTION_EMOJIS } from "../../../../constants/reactions"
import { useState } from 'react'

interface ReactionPickerProps {
    onReactionSelect: (emoji: string) => void
    trigger?: React.ReactNode
}

export function ReactionPicker({ onReactionSelect, trigger }: ReactionPickerProps) {
    const [isOpen, setIsOpen] = useState(false)

    const handleReactionClick = (emoji: string) => {
        onReactionSelect(emoji)
        setIsOpen(false)
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Smile className="h-3 w-3" />
                    </Button>
                )}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start">
                <div className="grid grid-cols-5 gap-1">
                    {REACTION_EMOJIS.map((emoji) => (
                        <Button
                            key={emoji}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-lg hover:bg-muted/50"
                            onClick={() => handleReactionClick(emoji)}
                        >
                            {emoji}
                        </Button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}
