"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/shared/components/ui/button"
import { Card } from "@/shared/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { MoreHorizontal, Upload, Search, Filter, Eye, Download, Trash2, Pin } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { TaskDetail } from "../../../../types/task.types"

interface FileItem {
    id: string
    name: string
    type: string
    size: number
    uploadedBy: {
        id: string
        name: string
        avatar?: string
    }
    uploadedAt: Date
    isPinned?: boolean
    url: string
}

interface FilesTabProps {
    currentTask: TaskDetail | null
}

// Mock data for demonstration
const mockFiles: FileItem[] = [
    {
        id: "1",
        name: "project-spec.pdf",
        type: "application/pdf",
        size: 2048576, // 2MB
        uploadedBy: {
            id: "user1",
            name: "Alice Johnson",
            avatar: "/placeholder.svg?height=32&width=32",
        },
        uploadedAt: new Date("2024-01-15T09:30:00"),
        isPinned: true,
        url: "#",
    },
    {
        id: "2",
        name: "wireframes.fig",
        type: "application/figma",
        size: 5242880, // 5MB
        uploadedBy: {
            id: "user2",
            name: "Bob Smith",
            avatar: "/placeholder.svg?height=32&width=32",
        },
        uploadedAt: new Date("2024-01-14T16:20:00"),
        url: "#",
    },
    {
        id: "3",
        name: "screenshot.png",
        type: "image/png",
        size: 1024000, // 1MB
        uploadedBy: {
            id: "user3",
            name: "Carol Davis",
            avatar: "/placeholder.svg?height=32&width=32",
        },
        uploadedAt: new Date("2024-01-13T11:45:00"),
        url: "#",
    },
]

const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return "🖼️"
    if (type.includes("pdf")) return "📄"
    if (type.includes("word") || type.includes("document")) return "📝"
    if (type.includes("excel") || type.includes("spreadsheet")) return "📊"
    if (type.includes("zip") || type.includes("rar")) return "🗜️"
    if (type.includes("figma")) return "🎨"
    return "📎"
}

const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return date.toLocaleDateString()
}

export function FilesTab({ currentTask }: FilesTabProps) {
    const [files, setFiles] = useState<FileItem[]>(mockFiles)
    const [isDragging, setIsDragging] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterType, setFilterType] = useState<string>("all")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const droppedFiles = Array.from(e.dataTransfer.files)
        handleFileUpload(droppedFiles)
    }

    const handleFileUpload = (uploadedFiles: File[]) => {
        const newFiles: FileItem[] = uploadedFiles.map((file) => ({
            id: Date.now().toString() + Math.random(),
            name: file.name,
            type: file.type,
            size: file.size,
            uploadedBy: {
                id: "current-user",
                name: "You",
                avatar: "/placeholder.svg?height=32&width=32",
            },
            uploadedAt: new Date(),
            url: URL.createObjectURL(file),
        }))
        setFiles([...newFiles, ...files])
    }

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFileUpload(Array.from(e.target.files))
        }
    }

    const togglePin = (fileId: string) => {
        setFiles(files.map((file) => (file.id === fileId ? { ...file, isPinned: !file.isPinned } : file)))
    }

    const deleteFile = (fileId: string) => {
        setFiles(files.filter((file) => file.id !== fileId))
    }

    const filteredFiles = files
        .filter((file) => {
            const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesFilter = filterType === "all" || file.type.startsWith(filterType)
            return matchesSearch && matchesFilter
        })
        .sort((a, b) => {
            // Pinned files first
            if (a.isPinned && !b.isPinned) return -1
            if (!a.isPinned && b.isPinned) return 1
            // Then by upload date (newest first)
            return b.uploadedAt.getTime() - a.uploadedAt.getTime()
        })

    return (
        <div className="space-y-6">
            {/* Upload Zone */}
            <Card
                className={`border-2 border-dashed p-8 text-center transition-colors ${
                    isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">Drag & drop files here, or click to browse</p>
                <p className="text-sm text-gray-500 mb-4">Maximum file size: 50MB</p>
                <Button onClick={() => fileInputRef.current?.click()}>Choose Files</Button>
                <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileInputChange} />
            </Card>

            {/* Search and Filter */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search files..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setFilterType("all")}>All Files</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilterType("image")}>Images</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilterType("application")}>Documents</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Files List */}
            <div className="space-y-2">
                {filteredFiles.map((file) => (
                    <Card key={file.id} className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 flex-1">
                                <div className="text-2xl">{getFileIcon(file.type)}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-medium text-gray-900 truncate">{file.name}</h3>
                                        {file.isPinned && <Pin className="h-4 w-4 text-blue-500" />}
                                    </div>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                        <div className="flex items-center space-x-2">
                                            <Avatar className="h-5 w-5">
                                                <AvatarImage
                                                    src={file.uploadedBy.avatar || "/placeholder.svg"}
                                                    alt={file.uploadedBy.name}
                                                />
                                                <AvatarFallback className="text-xs">
                                                    {file.uploadedBy.name.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span>{file.uploadedBy.name}</span>
                                        </div>
                                        <span>{formatDate(file.uploadedAt)}</span>
                                        <span>{formatFileSize(file.size)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                    <Download className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => togglePin(file.id)}>
                                            {file.isPinned ? "Unpin" : "Pin"} File
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => deleteFile(file.id)} className="text-red-600">
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </Card>
                ))}

                {filteredFiles.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        {searchQuery || filterType !== "all" ? "No files match your search criteria" : "No files uploaded yet"}
                    </div>
                )}
            </div>
        </div>
    )
}
