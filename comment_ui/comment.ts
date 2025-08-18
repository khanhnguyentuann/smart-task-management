export interface User {
  id: string
  name: string
  avatar: string
}

export interface Attachment {
  id: string
  name: string
  size: number
  type: string
  url: string
}

export interface Reaction {
  emoji: string
  count: number
  userReacted: boolean
}

export interface Comment {
  id: string
  content: string
  author: User
  createdAt: Date
  updatedAt: Date
  reactions?: Reaction[]
  attachments?: Attachment[]
  parentId?: string
  replies?: Comment[]
}
