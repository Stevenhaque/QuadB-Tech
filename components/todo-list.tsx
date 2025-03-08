"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { getTasks, updateTask, deleteTask } from "@/lib/api"
import type { Task } from "@/lib/types"
import TodoItem from "./todo-item"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()

  const search = searchParams.get("search") || ""
  const filter = searchParams.get("filter") || "all"
  const sort = searchParams.get("sort") || "newest"

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true)
        const data = await getTasks()
        setTasks(data)
        setError(null)
      } catch (err) {
        console.error("Failed to load tasks:", err)
        setError("Failed to load tasks. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadTasks()
  }, [])

  const handleToggleComplete = async (id: string, completed: boolean) => {
    // Optimistic update
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed } : task)))

    try {
      await updateTask(id, { completed })
    } catch (err) {
      // Revert on error
      setTasks(tasks)
      setError("Failed to update task. Please try again.")
    }
  }

  const handleDeleteTask = async (id: string) => {
    // Optimistic update
    const previousTasks = [...tasks]
    setTasks(tasks.filter((task) => task.id !== id))

    try {
      await deleteTask(id)
    } catch (err) {
      // Revert on error
      setTasks(previousTasks)
      setError("Failed to delete task. Please try again.")
    }
  }

  const handleUpdateTask = async (updatedTask: Task) => {
    // Optimistic update
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))

    try {
      await updateTask(updatedTask.id, updatedTask)
    } catch (err) {
      // Revert on error
      setTasks(tasks)
      setError("Failed to update task. Please try again.")
    }
  }

  // Filter tasks
  let filteredTasks = [...tasks]

  if (search) {
    filteredTasks = filteredTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description?.toLowerCase().includes(search.toLowerCase()),
    )
  }

  switch (filter) {
    case "completed":
      filteredTasks = filteredTasks.filter((task) => task.completed)
      break
    case "active":
      filteredTasks = filteredTasks.filter((task) => !task.completed)
      break
    case "high":
      filteredTasks = filteredTasks.filter((task) => task.priority === "high")
      break
    case "medium":
      filteredTasks = filteredTasks.filter((task) => task.priority === "medium")
      break
    case "low":
      filteredTasks = filteredTasks.filter((task) => task.priority === "low")
      break
  }

  // Sort tasks
  switch (sort) {
    case "newest":
      filteredTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    case "oldest":
      filteredTasks.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      break
    case "priority": {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      filteredTasks.sort(
        (a, b) =>
          priorityOrder[a.priority as keyof typeof priorityOrder] -
          priorityOrder[b.priority as keyof typeof priorityOrder],
      )
      break
    }
    case "dueDate":
      filteredTasks.sort((a, b) => {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      })
      break
    case "alphabetical":
      filteredTasks.sort((a, b) => a.title.localeCompare(b.title))
      break
  }

  if (loading) {
    return <p className="text-center py-8">Loading tasks...</p>
  }

  return (
    <div className="mt-6 space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No tasks found</p>
        </div>
      ) : (
        filteredTasks.map((task) => (
          <TodoItem
            key={task.id}
            task={task}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
            onUpdate={handleUpdateTask}
          />
        ))
      )}
    </div>
  )
}

