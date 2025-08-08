"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Search, UserPlus, Loader2 } from "lucide-react"
import { apiService } from "@/shared/services/api"

interface AddMemberModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  onAdded: () => void
}

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  avatar?: string
}

export function AddMemberModal({ open, onOpenChange, projectId, onAdded }: AddMemberModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Search users when query changes
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery.trim()) {
        setUsers([])
        return
      }

      setSearching(true)
      try {
        const response = await apiService.getUsers(searchQuery)
        const usersData = (response as any).data || response
        setUsers(Array.isArray(usersData) ? usersData : [])
      } catch (error) {
        console.error("Failed to search users:", error)
        setError("Failed to search users")
      } finally {
        setSearching(false)
      }
    }

    const timeoutId = setTimeout(searchUsers, 300) // Debounce search
    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) return

    setLoading(true)
    try {
      await apiService.addProjectMembers(projectId, selectedUsers)
      onAdded()
      onOpenChange(false)
      setSelectedUsers([])
      setSearchQuery("")
      setUsers([])
    } catch (error) {
      console.error("Failed to add members:", error)
      setError("Failed to add members to project")
    } finally {
      setLoading(false)
    }
  }

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleClose = () => {
    onOpenChange(false)
    setSelectedUsers([])
    setSearchQuery("")
    setUsers([])
    setError(null)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add Members to Project
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          {/* Users List */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {searching ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Searching users...
              </div>
            ) : users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleUserToggle(user.id)}
                >
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleUserToggle(user.id)}
                  />
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={`${user.firstName} ${user.lastName}`} />
                    <AvatarFallback>
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              ))
            ) : searchQuery ? (
              <div className="text-center py-4 text-muted-foreground">
                No users found matching &quot;{searchQuery}&quot;
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Start typing to search for users
              </div>
            )}
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Users ({selectedUsers.length})</Label>
              <div className="flex flex-wrap gap-2">
                {users
                  .filter(user => selectedUsers.includes(user.id))
                  .map((user) => (
                    <Badge key={user.id} variant="secondary" className="flex items-center gap-1">
                      {user.firstName} {user.lastName}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleUserToggle(user.id)
                        }}
                        className="ml-1 hover:bg-muted-foreground/20 rounded-full w-4 h-4 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddMembers} 
              disabled={selectedUsers.length === 0 || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add {selectedUsers.length} Member{selectedUsers.length !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
