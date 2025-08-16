"use client"

import { motion } from "framer-motion"
import { EnhancedButton } from "@/shared/components/ui/enhanced-button"
import { Sparkles, Users, CheckSquare, BarChart3 } from "lucide-react"

interface WelcomeScreenProps {
  onGetStarted: () => void
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const features = [
    {
      icon: CheckSquare,
      title: "Smart Task Management",
      description: "AI-powered task organization with intelligent prioritization",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamless teamwork with real-time updates and notifications",
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Visual analytics and insights to boost productivity",
    },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#0b1220] relative pb-20 sm:pr-16">
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/20 backdrop-contrast-125"></div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-20 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 sm:space-y-6"
        >
          {/* Logo and Title */}
          <div className="space-y-4 sm:space-y-6">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
              className="inline-block"
              style={{
                animationPlayState: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'paused' : 'running'
              }}
            >
              <div className="flex items-center justify-center gap-2 sm:gap-3 text-[clamp(28px,6vw,56px)] font-bold text-white leading-tight tracking-tight">
                <Sparkles className="h-8 w-8 sm:h-12 sm:w-12" />
                <span className="text-balance">Smart Task</span>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl mx-auto text-base sm:text-lg text-white/70 text-balance"
            >
              Transform your productivity with AI-powered task management. Organize, collaborate, and achieve more with
              your team.
            </motion.p>
          </div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid gap-y-10 sm:grid-cols-3 sm:gap-x-8 my-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.2 }}
                className="space-y-4"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="inline-block p-3 sm:p-4 bg-white/5 rounded-full"
                >
                  <feature.icon className="size-10 sm:size-12 text-blue-400" />
                </motion.div>
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="text-sm text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button - Second one at the bottom */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, type: "spring" }}
            className="flex justify-center mb-[env(safe-area-inset-bottom)]"
          >
            <EnhancedButton
              onClick={onGetStarted}
              size="lg"
              className="h-12 px-6 text-base rounded-full"
              aria-label="Get started"
            >
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Get Started
            </EnhancedButton>
          </motion.div>

        </motion.div>
      </div>
    </div>
  )
} 
