"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label as UI_Label } from "@/shared/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Tag, Plus, X, Edit3 } from 'lucide-react'

interface LabelsSectionProps {
    labels: any[]
    isEditing?: boolean
    canEdit?: boolean
    onAddLabel?: (label: any) => void
    onDeleteLabel?: (labelId: string) => void
}

const labelColors = [
    { name: "Red", value: "bg-red-500" },
    { name: "Blue", value: "bg-blue-500" },
    { name: "Green", value: "bg-green-500" },
    { name: "Yellow", value: "bg-yellow-500" },
    { name: "Purple", value: "bg-purple-500" },
    { name: "Pink", value: "bg-pink-500" },
    { name: "Orange", value: "bg-orange-500" },
    { name: "Teal", value: "bg-teal-500" },
]

export function LabelsSection({
    labels,
    isEditing,
    canEdit,
    onAddLabel,
    onDeleteLabel
}: LabelsSectionProps) {
    const [editMode, setEditMode] = useState(false)
    const [newLabel, setNewLabel] = useState({ name: "", color: "bg-blue-500" })
    const [loading, setLoading] = useState(false)

    const handleAddLabel = () => {
        if (!newLabel.name.trim() || !onAddLabel) return
        setLoading(true)
        try {
            const newLabelData = {
                id: Date.now().toString(),
                name: newLabel.name.trim(),
                color: newLabel.color
            }
            onAddLabel(newLabelData)
            setNewLabel({ name: "", color: "bg-blue-500" })
        } catch (error) {
            console.error("Failed to add label:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteLabel = (labelId: string) => {
        if (!onDeleteLabel) return
        try {
            onDeleteLabel(labelId)
        } catch (error) {
            console.error("Failed to delete label:", error)
        }
    }

    return (
        <Card className="border-border hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                    <Tag className="h-5 w-5 text-green-500" />
                    Labels
                    <Badge variant="secondary" className="ml-auto text-xs px-2 py-1 bg-muted">
                        {labels.length}
                    </Badge>
                    {/* Edit Button */}
                    {canEdit && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditMode(!editMode)}
                            className="h-6 w-6 p-0 ml-2"
                        >
                            <Edit3 className="h-3 w-3" />
                        </Button>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Existing Labels */}
                <div className="flex flex-wrap gap-2">
                    {labels.map((label) => (
                        <div key={label.id} className="flex items-center gap-1">
                            <Badge className={`${label.color} text-white hover:opacity-80`}>
                                {label.name}
                            </Badge>
                            {/* Remove Button */}
                            {editMode && canEdit && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteLabel(label.id)}
                                    className="h-5 w-5 p-0 hover:bg-destructive/10"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Add Button */}
                {editMode && canEdit && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-2 border-dashed hover:bg-accent hover:border-solid transition-all duration-200 bg-transparent"
                            >
                                <Plus className="h-4 w-4" />
                                Add label
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Label</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <UI_Label htmlFor="labelName">Label Name</UI_Label>
                                    <Input
                                        id="labelName"
                                        value={newLabel.name}
                                        onChange={(e) => setNewLabel({ ...newLabel, name: e.target.value })}
                                        placeholder="Enter label name"
                                    />
                                </div>
                                <div>
                                    <UI_Label htmlFor="labelColor">Color</UI_Label>
                                    <Select
                                        value={newLabel.color}
                                        onValueChange={(value) => setNewLabel({ ...newLabel, color: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {labelColors.map((color) => (
                                                <SelectItem key={color.value} value={color.value}>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-3 h-3 rounded-full ${color.value}`} />
                                                        {color.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={handleAddLabel} className="w-full" disabled={loading}>
                                    Add Label
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}

                {/* Empty State */}
                {labels.length === 0 && !editMode && (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                        No labels assigned
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
