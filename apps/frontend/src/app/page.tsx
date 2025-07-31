import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Smart Task Management
        </h1>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          AI-powered task management system to boost your team&#39;s productivity
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}