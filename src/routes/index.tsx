import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "My Tasks — To-Do List" },
      {
        name: "description",
        content: "A clean, simple to-do list. Add tasks, mark them done, and delete them.",
      },
      { property: "og:title", content: "My Tasks — To-Do List" },
      {
        property: "og:description",
        content: "A clean, simple to-do list. Add tasks, mark them done, and delete them.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

type Task = {
  id: number;
  text: string;
  done: boolean;
};

function Index() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Welcome to your to-do list", done: false },
    { id: 2, text: "Click the circle to mark a task done", done: true },
  ]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    const text = newTask.trim();
    if (!text) return;
    setTasks((prev) => [...prev, { id: Date.now(), text, done: false }]);
    setNewTask("");
  };

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const remaining = tasks.filter((t) => !t.done).length;

  return (
    <div className="flex min-h-screen items-start justify-center bg-background px-4 py-16 sm:py-24">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">
            My Tasks
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {remaining === 0
              ? "All done — nice work!"
              : `${remaining} task${remaining === 1 ? "" : "s"} remaining`}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              addTask();
            }}
          >
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              aria-label="New task"
              className="flex-1"
            />
            <Button type="submit" size="icon" aria-label="Add task">
              <Plus className="size-4" />
            </Button>
          </form>

          {tasks.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No tasks yet. Add one above to get started.
            </p>
          ) : (
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5 transition-colors",
                    task.done && "bg-muted/50",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    aria-label={task.done ? "Mark as not done" : "Mark as done"}
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-muted-foreground/40 transition-colors",
                      task.done &&
                        "border-primary bg-primary text-primary-foreground",
                    )}
                  >
                    {task.done && <Check className="size-3" />}
                  </button>
                  <span
                    className={cn(
                      "flex-1 text-sm",
                      task.done && "text-muted-foreground line-through",
                    )}
                  >
                    {task.text}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                    aria-label="Delete task"
                    className="size-8 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
