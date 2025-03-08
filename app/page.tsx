import { Suspense } from "react"
import TodoList from "@/components/todo-list"
import TodoHeader from "@/components/todo-header"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 bg-background">
      <div className="max-w-4xl mx-auto">
        <TodoHeader />
        <Suspense fallback={<TodoSkeleton />}>
          <TodoList />
        </Suspense>
      </div>
    </main>
  )
}

function TodoSkeleton() {
  return (
    <div className="space-y-4 mt-8">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
          <Skeleton className="h-5 w-5 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  )
}

