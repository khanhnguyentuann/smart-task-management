"use client"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

export function EnhancedThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <motion.button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative w-12 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 p-1 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Toggle background */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
        initial={false}
        animate={{
          opacity: theme === "light" ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Slider */}
      <motion.div
        className="relative w-4 h-4 bg-white rounded-full shadow-lg flex items-center justify-center"
        initial={false}
        animate={{
          x: theme === "dark" ? 24 : 0,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <AnimatePresence mode="wait">
          {theme === "light" ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              exit={{ rotate: 90, scale: 0 }}
              transition={{ duration: 0.2 }}
              className="text-yellow-500 text-xs"
            >
              ☀️
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              exit={{ rotate: -90, scale: 0 }}
              transition={{ duration: 0.2 }}
              className="text-blue-500 text-xs"
            >
              🌙
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  )
} 
