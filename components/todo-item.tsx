"use client"

import { useState } from "react"
import { format } from "date-fns"
import type { Task } from "@/lib/types"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Edit, MoreVertical, Trash2 } from "lucide-react"
import EditTaskDialog from "./edit-task-dialog"

interface TodoItemProps {
  task: Task
  onToggleComplete: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
  onUpdate: (task: Task) => void
}

export default function TodoItem({ task, onToggleComplete, onDelete, onUpdate }: TodoItemProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)

  const priorityColors = {
    low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed

  return (
    <Card className={`transition-all ${task.completed ? "opacity-70" : ""}`}>
      <CardHeader className="p-4 pb-0 flex flex-row items-start justify-between">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={(checked) => {
              onToggleComplete(task.id, checked === true)
            }}
            className="mt-1"
          />
          <div>
            <h3 className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
              {task.title}
            </h3>
            {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(task.id)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <div className="flex flex-wrap gap-2 mt-2">
          {task.category && <Badge variant="outline">{task.category}</Badge>}

          {task.priority && (
            <Badge className={priorityColors[task.priority as keyof typeof priorityColors]}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
            </Badge>
          )}
        </div>
      </CardContent>

      {(task.dueDate || task.createdAt) && (
        <CardFooter className="p-4 pt-0 flex flex-wrap gap-4 text-xs text-muted-foreground">
          {task.dueDate && (
            <div className={`flex items-center gap-1 ${isOverdue ? "text-destructive" : ""}`}>
              <Calendar className="h-3 w-3" />
              <span>
                Due: {format(new Date(task.dueDate), "MMM d, yyyy")}
                {isOverdue && " (Overdue)"}
              </span>
            </div>
          )}

          {task.createdAt && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Created: {format(new Date(task.createdAt), "MMM d, yyyy")}</span>
            </div>
          )}
        </CardFooter>
      )}

      <EditTaskDialog open={isEditOpen} onOpenChange={setIsEditOpen} task={task} onUpdate={onUpdate} />
    </Card>
  )
}

