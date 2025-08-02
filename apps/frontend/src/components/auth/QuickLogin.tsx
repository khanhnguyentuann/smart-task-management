"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar"
import { MockUser } from "@/data/mock-users"
import { useState } from "react"

interface QuickLoginProps {
    users: MockUser[]
    onLogin: (user: MockUser) => void
    loading?: boolean
}

export function QuickLogin({ users, onLogin, loading = false }: QuickLoginProps) {
    const [hoveredUser, setHoveredUser] = useState<MockUser | null>(null)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
        >
            <p className="text-sm text-muted-foreground text-center">Đăng nhập nhanh:</p>
            <div className="flex justify-center gap-3">
                {users.map((user, index) => (
                    <motion.button
                        key={user.id}
                        onClick={() => onLogin(user)}
                        disabled={loading}
                        className="relative group disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        onHoverStart={() => setHoveredUser(user)}
                        onHoverEnd={() => setHoveredUser(null)}
                    >
                        <Avatar className="h-12 w-12 ring-2 ring-background group-hover:ring-primary/50 transition-all shadow-md hover:shadow-lg">
                            <AvatarImage
                                src={user.avatar}
                                alt={user.name}
                                className="object-cover"
                            />
                            <AvatarFallback className="text-sm font-medium">
                                {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                            </AvatarFallback>
                        </Avatar>

                        {/* Tooltip căn giữa với flexbox */}
                        <AnimatePresence>
                            {hoveredUser?.id === user.id && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 5, scale: 0.9 }}
                                    className="absolute -top-16 left-0 right-0 flex justify-center z-50 pointer-events-none"
                                >
                                    <div className="bg-foreground text-background text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg relative">
                                        <div className="text-center">
                                            <p className="font-medium">{user.name}</p>
                                            <p className="opacity-75">{user.role}</p>
                                        </div>
                                        {/* Arrow */}
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground"></div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                ))}
            </div>
        </motion.div>
    )
}