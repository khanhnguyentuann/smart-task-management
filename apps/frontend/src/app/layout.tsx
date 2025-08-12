import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/features/layout"
import { Toaster } from "@/shared/components/ui/toast"
import { ErrorBoundary } from "@/shared/components/error"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Smart Task Management",
  description: "A modern task management application",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
