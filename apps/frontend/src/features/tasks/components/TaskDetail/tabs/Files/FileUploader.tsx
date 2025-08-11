"use client"

import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import { Label } from "@/shared/components/ui/label"
import { Button, buttonVariants } from "@/shared/components/ui/button"
import { Upload } from 'lucide-react'
import { useCallback } from "react"

interface FileUploaderProps {
    fileInputRef: React.RefObject<HTMLInputElement | null>
    onFileSelect?: (files: FileList) => void
    multiple?: boolean
    accept?: string
    maxSize?: number // in MB
}

export function FileUploader({
    fileInputRef,
    onFileSelect,
    multiple = true,
    accept,
    maxSize = 10
}: FileUploaderProps) {
    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && onFileSelect) {
            // Validate file sizes
            const oversizedFiles = Array.from(files).filter(file => file.size > maxSize * 1024 * 1024)
            if (oversizedFiles.length > 0) {
                alert(`Some files exceed the ${maxSize}MB limit and will be ignored.`)
                return
            }
            onFileSelect(files)
        }
    }, [onFileSelect, maxSize])

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()

        const files = e.dataTransfer.files
        if (files && onFileSelect) {
            onFileSelect(files)
        }
    }, [onFileSelect])

    return (
        <Card>
            <CardHeader>
                <Label>Upload Files</Label>
            </CardHeader>
            <CardContent>
                <div
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple={multiple}
                        accept={accept}
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop files here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                        Maximum file size: {maxSize}MB
                    </p>
                    <Button variant="outline" size="sm">
                        Choose Files
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
