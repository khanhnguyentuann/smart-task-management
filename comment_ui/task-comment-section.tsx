"use client"

import { useState } from "react"
import { CommentEditor } from "./comment-editor"
import { CommentThread } from "./comment-thread"
import type { Comment } from "@/types/comment"

interface TaskCommentSectionProps {
  taskId: string
}

// Mock data for demonstration
const mockComments: Comment[] = [
  {
    id: "1",
    content:
      'We should use **NextAuth.js** for authentication. It supports multiple providers and has great TypeScript support.\n\n```typescript\nimport NextAuth from "next-auth"\nimport GoogleProvider from "next-auth/providers/google"\n```',
    author: {
      id: "user1",
      name: "Alice Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: new Date("2024-01-15T10:30:00"),
    updatedAt: new Date("2024-01-15T10:30:00"),
    reactions: [
      { emoji: "👍", count: 3, userReacted: true },
      { emoji: "🔥", count: 1, userReacted: false },
    ],
    replies: [
      {
        id: "2",
        content:
          "Great suggestion! @alice I agree with using NextAuth. Should we also consider **Clerk** as an alternative?",
        author: {
          id: "user2",
          name: "Bob Smith",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        createdAt: new Date("2024-01-15T11:00:00"),
        updatedAt: new Date("2024-01-15T11:00:00"),
        reactions: [
          { emoji: "👍", count: 2, userReacted: false },
          { emoji: "👀", count: 1, userReacted: true },
        ],
        parentId: "1",
      },
    ],
  },
  {
    id: "3",
    content:
      "✅ **Update**: I've completed the initial setup for NextAuth.js. The configuration is ready for Google and GitHub providers.",
    author: {
      id: "user3",
      name: "Carol Davis",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: new Date("2024-01-15T14:20:00"),
    updatedAt: new Date("2024-01-15T14:20:00"),
    reactions: [
      { emoji: "✅", count: 4, userReacted: true },
      { emoji: "❤️", count: 2, userReacted: false },
    ],
  },
]

export function TaskCommentSection({ taskId }: TaskCommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(mockComments)

  const handleAddComment = (content: string, files?: File[]) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      content,
      author: {
        id: "current-user",
        name: "You",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      reactions: [],
      attachments: files?.map((file) => ({
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      })),
    }
    setComments([...comments, newComment])
  }

  const handleAddReply = (parentId: string, content: string, files?: File[]) => {
    const newReply: Comment = {
      id: Date.now().toString(),
      content,
      author: {
        id: "current-user",
        name: "You",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      reactions: [],
      parentId,
      attachments: files?.map((file) => ({
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      })),
    }

    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === parentId ? { ...comment, replies: [...(comment.replies || []), newReply] } : comment,
      ),
    )
  }

  const handleReaction = (commentId: string, emoji: string) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === commentId) {
          const existingReaction = comment.reactions?.find((r) => r.emoji === emoji)
          if (existingReaction) {
            return {
              ...comment,
              reactions: comment.reactions?.map((r) =>
                r.emoji === emoji
                  ? { ...r, count: r.userReacted ? r.count - 1 : r.count + 1, userReacted: !r.userReacted }
                  : r,
              ),
            }
          } else {
            return {
              ...comment,
              reactions: [...(comment.reactions || []), { emoji, count: 1, userReacted: true }],
            }
          }
        }

        // Handle reactions on replies
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map((reply) => {
              if (reply.id === commentId) {
                const existingReaction = reply.reactions?.find((r) => r.emoji === emoji)
                if (existingReaction) {
                  return {
                    ...reply,
                    reactions: reply.reactions?.map((r) =>
                      r.emoji === emoji
                        ? { ...r, count: r.userReacted ? r.count - 1 : r.count + 1, userReacted: !r.userReacted }
                        : r,
                    ),
                  }
                } else {
                  return {
                    ...reply,
                    reactions: [...(reply.reactions || []), { emoji, count: 1, userReacted: true }],
                  }
                }
              }
              return reply
            }),
          }
        }

        return comment
      }),
    )
  }

  return (
    <div className="space-y-6">
      <CommentEditor onSubmit={handleAddComment} placeholder="Add a comment..." />

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentThread key={comment.id} comment={comment} onReply={handleAddReply} onReaction={handleReaction} />
        ))}
      </div>
    </div>
  )
}
