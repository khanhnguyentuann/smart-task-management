import { TaskCommentSection } from "@/components/task-comment-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Smart Task Management</h1>
          <p className="text-muted-foreground">Task: Implement user authentication system</p>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Task Comments</h2>
          <TaskCommentSection taskId="task-123" />
        </div>
      </div>
    </div>
  )
}
