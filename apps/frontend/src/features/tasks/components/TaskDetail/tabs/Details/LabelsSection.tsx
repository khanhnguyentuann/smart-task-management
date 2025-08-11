"use client"

import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import { Label } from "@/shared/components/ui/label"
import { Badge } from "@/shared/components/ui/badge"
import { Button, buttonVariants } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Tag, Plus, X } from 'lucide-react'

interface LabelsSection {
    labels?: Array<{
        id: string
        name: string
        color: string
    }>
    isEditing?: boolean
    newLabel: string
    setNewLabel: (value: string) => void
    onAddLabel: () => void
    onDeleteLabel?: (labelId: string) => void
}

export function LabelsSection({
    labels = [],
    isEditing,
    newLabel,
    setNewLabel,
    onAddLabel,
    onDeleteLabel
}: LabelsSection) {
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && newLabel.trim()) {
            onAddLabel()
        }
    }

    return (
        <Card>
            <CardHeader>
                <Label className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Labels
                </Label>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2 flex-wrap">
                    {labels.map((label) => (
                        <div key={label.id} className="flex items-center gap-1">
                            <Badge className={`${label.color} text-white`}>
                                {label.name}
                            </Badge>
                            {isEditing && onDeleteLabel && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-4 w-4 p-0 hover:bg-red-100"
                                    onClick={() => onDeleteLabel(label.id)}
                                >
                                    <X className="h-3 w-3 text-red-600" />
                                </Button>
                            )}
                        </div>
                    ))}

                    {labels.length === 0 && !isEditing && (
                        <span className="text-sm text-muted-foreground">No labels assigned</span>
                    )}

                    {isEditing && (
                        <div className="flex items-center gap-2">
                            <Input
                                value={newLabel}
                                onChange={(e) => setNewLabel(e.target.value)}
                                placeholder="Add label..."
                                className="w-24 h-6 text-xs"
                                onKeyPress={handleKeyPress}
                            />
                            <Button
                                onClick={onAddLabel}
                                size="sm"
                                variant="outline"
                                className="h-6 px-2"
                                disabled={!newLabel.trim()}
                            >
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
