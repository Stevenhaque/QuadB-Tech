import type { Task } from "./types"

// Mock API functions that use localStorage
const STORAGE_KEY = "todo-app-tasks"

// Helper to get tasks from localStorage
const getTasksFromStorage = (): Task[] => {
  if (typeof window === "undefined") return []

  const tasks = localStorage.getItem(STORAGE_KEY)
  return tasks ? JSON.parse(tasks) : []
}

// Helper to save tasks to localStorage
const saveTasksToStorage = (tasks: Task[]) => {
  if (typeof window === "undefined") return

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

// Get all tasks
export const getTasks = async (): Promise<Task[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return getTasksFromStorage()
}

// Create a new task
export const createTask = async (task: Task): Promise<Task> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const tasks = getTasksFromStorage()
  tasks.push(task)
  saveTasksToStorage(tasks)

  return task
}

// Update a task
export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const tasks = getTasksFromStorage()
  const taskIndex = tasks.findIndex((task) => task.id === id)

  if (taskIndex === -1) {
    throw new Error(`Task with id ${id} not found`)
  }

  const updatedTask = { ...tasks[taskIndex], ...updates }
  tasks[taskIndex] = updatedTask
  saveTasksToStorage(tasks)

  return updatedTask
}

// Delete a task
export const deleteTask = async (id: string): Promise<void> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const tasks = getTasksFromStorage()
  const filteredTasks = tasks.filter((task) => task.id !== id)
  saveTasksToStorage(filteredTasks)
}

