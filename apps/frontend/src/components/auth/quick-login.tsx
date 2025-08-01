"use client"

import { motion } from "framer-motion"
import { MockUser } from "@/data/mock-users"

interface QuickLoginProps {
    users: MockUser[]
    onLogin: (user: MockUser) => void
    loading?: boolean
}

export function QuickLogin({ users, onLogin, loading = false }: QuickLoginProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
        >
            <p className="text-sm text-muted-foreground text-center">Đăng nhập nhanh:</p>
            <div className="grid grid-cols-2 gap-2">
                {users.map((user, index) => (
                    <motion.button
                        key={user.id}
                        onClick={() => onLogin(user)}
                        disabled={loading}
                        className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                    >
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-background group-hover:ring-primary/50 transition-all"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.role}</p>
                        </div>
                    </motion.button>
                ))}
            </div>
        </motion.div>
    )
}