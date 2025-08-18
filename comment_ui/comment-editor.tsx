"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bold, Italic, List, Code, Paperclip, Send, X, AtSign } from "lucide-react"
import { cn } from "@/lib/utils"

interface CommentEditorProps {
  onSubmit: (content: string, files?: File[]) => void
  placeholder?: string
  initialContent?: string
  quotedContent?: string
  onCancel?: () => void
  compact?: boolean
}

const TEAM_MEMBERS = [
  { id: "user1", name: "Alice Johnson", username: "alice" },
  { id: "user2", name: "Bob Smith", username: "bob" },
  { id: "user3", name: "Carol Davis", username: "carol" },
  { id: "user4", name: "David Wilson", username: "david" },
]

export function CommentEditor({
  onSubmit,
  placeholder = "Write a comment...",
  initialContent = "",
  quotedContent,
  onCancel,
  compact = false,
}: CommentEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [files, setFiles] = useState<File[]>([])
  const [showMentions, setShowMentions] = useState(false)
  const [mentionQuery, setMentionQuery] = useState("")
  const [cursorPosition, setCursorPosition] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = () => {
    if (!content.trim() && files.length === 0) return

    let finalContent = content
    if (quotedContent) {
      finalContent = `> ${quotedContent.replace(/\n/g, "\n> ")}\n\n${content}`
    }

    onSubmit(finalContent, files)
    setContent("")
    setFiles([])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }

    if (e.key === "@") {
      setShowMentions(true)
      setMentionQuery("")
      setCursorPosition(textareaRef.current?.selectionStart || 0)
    }

    if (showMentions && (e.key === "Escape" || e.key === " ")) {
      setShowMentions(false)
    }
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setContent(value)

    if (showMentions) {
      const cursorPos = e.target.selectionStart
      const textBeforeCursor = value.substring(0, cursorPos)
      const lastAtIndex = textBeforeCursor.lastIndexOf("@")

      if (lastAtIndex !== -1) {
        const query = textBeforeCursor.substring(lastAtIndex + 1)
        if (query.includes(" ") || query.includes("\n")) {
          setShowMentions(false)
        } else {
          setMentionQuery(query)
        }
      } else {
        setShowMentions(false)
      }
    }
  }

  const insertMention = (member: (typeof TEAM_MEMBERS)[0]) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const beforeCursor = content.substring(0, cursorPosition)
    const afterCursor = content.substring(textarea.selectionStart)
    const lastAtIndex = beforeCursor.lastIndexOf("@")

    const newContent = beforeCursor.substring(0, lastAtIndex) + `@${member.username} ` + afterCursor

    setContent(newContent)
    setShowMentions(false)

    // Focus back to textarea
    setTimeout(() => {
      textarea.focus()
      const newPosition = lastAtIndex + member.username.length + 2
      textarea.setSelectionRange(newPosition, newPosition)
    }, 0)
  }

  const insertFormatting = (format: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)

    let newText = ""
    let cursorOffset = 0

    switch (format) {
      case "bold":
        newText = `**${selectedText}**`
        cursorOffset = selectedText ? 0 : 2
        break
      case "italic":
        newText = `*${selectedText}*`
        cursorOffset = selectedText ? 0 : 1
        break
      case "code":
        newText = `\`${selectedText}\``
        cursorOffset = selectedText ? 0 : 1
        break
      case "list":
        newText = `\n- ${selectedText}`
        cursorOffset = selectedText ? 0 : 0
        break
    }

    const newContent = content.substring(0, start) + newText + content.substring(end)
    setContent(newContent)

    setTimeout(() => {
      textarea.focus()
      const newPosition = start + newText.length - cursorOffset
      textarea.setSelectionRange(newPosition, newPosition)
    }, 0)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    setFiles((prev) => [...prev, ...selectedFiles])
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const filteredMembers = TEAM_MEMBERS.filter(
    (member) =>
      member.name.toLowerCase().includes(mentionQuery.toLowerCase()) ||
      member.username.toLowerCase().includes(mentionQuery.toLowerCase()),
  )

  return (
    <Card className={cn("p-4", compact && "p-3")}>
      {quotedContent && (
        <div className="mb-3 p-3 bg-muted rounded border-l-4 border-primary">
          <div className="text-sm text-muted-foreground whitespace-pre-wrap">{quotedContent}</div>
        </div>
      )}

      <div className="space-y-3">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn("min-h-[100px] resize-none", compact && "min-h-[80px]")}
          />

          {showMentions && filteredMembers.length > 0 && (
            <Card className="absolute z-10 mt-1 w-64 max-h-48 overflow-y-auto">
              {filteredMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => insertMention(member)}
                  className="w-full px-3 py-2 text-left hover:bg-accent flex items-center gap-2"
                >
                  <AtSign className="h-4 w-4" />
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">@{member.username}</div>
                  </div>
                </button>
              ))}
            </Card>
          )}
        </div>

        {files.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {files.map((file, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {file.name}
                <button
                  onClick={() => removeFile(index)}
                  className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => insertFormatting("bold")} className="h-8 w-8 p-0">
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => insertFormatting("italic")} className="h-8 w-8 p-0">
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => insertFormatting("code")} className="h-8 w-8 p-0">
              <Code className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => insertFormatting("list")} className="h-8 w-8 p-0">
              <List className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} className="h-8 w-8 p-0">
              <Paperclip className="h-4 w-4" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
          </div>

          <div className="flex items-center gap-2">
            {onCancel && (
              <Button variant="ghost" size="sm" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button size="sm" onClick={handleSubmit} disabled={!content.trim() && files.length === 0} className="gap-1">
              <Send className="h-4 w-4" />
              {compact ? "Reply" : "Comment"}
            </Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">Press Cmd+Enter to submit • Use @ to mention team members</div>
      </div>
    </Card>
  )
}
