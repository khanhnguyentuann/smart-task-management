"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip"
import { Tag, Plus, X, Edit3, Loader2 } from 'lucide-react'

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
    const [inlineAddLabel, setInlineAddLabel] = useState(false)
    const [newLabel, setNewLabel] = useState({ name: "", color: "bg-blue-500" })
    const [loading, setLoading] = useState(false)
    const labelInputRef = useRef<HTMLInputElement>(null)

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
            setInlineAddLabel(false)
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

    const handleInlineLabelAdd = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && newLabel.name.trim()) {
            handleAddLabel()
        } else if (e.key === "Escape") {
            setInlineAddLabel(false)
            setNewLabel({ name: "", color: "bg-blue-500" })
        }
    }

    const hasEditPermission = () => {
        return canEdit
    }

    useEffect(() => {
        if (inlineAddLabel) {
            labelInputRef.current?.focus()
        }
    }, [inlineAddLabel])

    return (
        <TooltipProvider>
            <Card className="border-border hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                        <Tag className="h-5 w-5 text-green-500" />
                        {labels.length} labels
                        {loading && <Loader2 className="h-4 w-4 animate-spin ml-auto" />}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => hasEditPermission() && setEditMode(!editMode)}
                                    disabled={!hasEditPermission()}
                                    className="h-8 w-8 p-0 ml-auto"
                                >
                                    <Edit3 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            {!hasEditPermission() && (
                                <TooltipContent>
                                    <p>Bạn chỉ có thể chỉnh khi là Maintainer/Owner</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {labels.length === 0 && !inlineAddLabel ? (
                        <div className="text-center py-6 text-muted-foreground">
                            <Tag className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Thêm label để dễ lọc và báo cáo.</p>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {labels.map((label) => (
                                <div key={label.id} className="flex items-center gap-1">
                                    <Badge className={`${label.color} text-white hover:opacity-80`}>
                                        {label.name}
                                    </Badge>
                                    {editMode && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteLabel(label.id)}
                                            className="h-6 w-6 p-0 hover:bg-destructive/10"
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {editMode && (
                        <>
                            {inlineAddLabel ? (
                                <div className="flex gap-2">
                                    <Input
                                        ref={labelInputRef}
                                        value={newLabel.name}
                                        onChange={(e) => setNewLabel({ ...newLabel, name: e.target.value })}
                                        onKeyDown={handleInlineLabelAdd}
                                        placeholder="Nhập tên label..."
                                        className="flex-1"
                                    />
                                    <Select
                                        value={newLabel.color}
                                        onValueChange={(value) => setNewLabel({ ...newLabel, color: value })}
                                    >
                                        <SelectTrigger className="w-24">
                                            <div className={`w-4 h-4 rounded-full ${newLabel.color}`} />
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
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={() => setInlineAddLabel(true)}
                                    className="w-full justify-start gap-2 border-dashed hover:bg-accent hover:border-solid transition-all duration-200 bg-transparent"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add label
                                </Button>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </TooltipProvider>
    )
}
