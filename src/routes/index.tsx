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
        content:
          "A clean, simple to-do list. Add tasks with a priority, filter them, mark them done, and delete them.",
      },
      { property: "og:title", content: "My Tasks — To-Do List" },
      {
        property: "og:description",
        content:
          "A clean, simple to-do list. Add tasks with a priority, filter them, mark them done, and delete them.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

type Priority = "low" | "mid" | "high" | "critical";
type Filter = Priority | "all";

type Task = {
  id: number;
  text: string;
  done: boolean;
  priority: Priority;
};

const PRIORITIES: {
  value: Priority;
  label: string;
  dot: string;
  badge: string;
  active: string;
}[] = [
  {
    value: "low",
    label: "Low",
    dot: "bg-priority-low",
    badge: "border-priority-low/30 bg-priority-low/10 text-priority-low",
    active: "border-priority-low/40 bg-priority-low/10 text-priority-low",
  },
  {
    value: "mid",
    label: "Mid",
    dot: "bg-priority-mid",
    badge: "border-priority-mid/30 bg-priority-mid/10 text-priority-mid",
    active: "border-priority-mid/40 bg-priority-mid/10 text-priority-mid",
  },
  {
    value: "high",
    label: "High",
    dot: "bg-priority-high",
    badge: "border-priority-high/30 bg-priority-high/10 text-priority-high",
    active: "border-priority-high/40 bg-priority-high/10 text-priority-high",
  },
  {
    value: "critical",
    label: "Critical",
    dot: "bg-priority-critical",
    badge:
      "border-priority-critical/30 bg-priority-critical/10 text-priority-critical",
    active:
      "border-priority-critical/40 bg-priority-critical/10 text-priority-critical",
  },
];

const PRIORITY_LABEL: Record<Priority, string> = {
  low: "Low",
  mid: "Mid",
  high: "High",
  critical: "Critical",
};

function Index() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      text: "Welcome to your to-do list",
      done: false,
      priority: "mid",
    },
    {
      id: 2,
      text: "Click the circle to mark a task done",
      done: true,
      priority: "low",
    },
  ]);
  const [newTask, setNewTask] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("mid");
  const [filter, setFilter] = useState<Filter>("all");

  const addTask = () => {
    const text = newTask.trim();
    if (!text) return;
    setTasks((prev) => [
      ...prev,
      { id: Date.now(), text, done: false, priority: newPriority },
    ]);
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
  const visible = tasks.filter((t) => filter === "all" || t.priority === filter);
  const countFor = (p: Priority) => tasks.filter((t) => t.priority === p).length;

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
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              addTask();
            }}
          >
            <div className="flex gap-2">
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
            </div>

            <div
              role="radiogroup"
              aria-label="New task priority"
              className="flex flex-wrap gap-1.5"
            >
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  role="radio"
                  aria-checked={newPriority === p.value}
                  onClick={() => setNewPriority(p.value)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    newPriority === p.value
                      ? p.active
                      : "border-border text-muted-foreground hover:bg-muted",
                  )}
                >
                  <span className={cn("size-1.5 rounded-full", p.dot)} />
                  {p.label}
                </button>
              ))}
            </div>
          </form>

          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Filter
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                aria-pressed={filter === "all"}
                onClick={() => setFilter("all")}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  filter === "all"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:bg-muted",
                )}
              >
                All ({tasks.length})
              </button>
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  aria-pressed={filter === p.value}
                  onClick={() => setFilter(p.value)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    filter === p.value
                      ? p.active
                      : "border-border text-muted-foreground hover:bg-muted",
                  )}
                >
                  <span className={cn("size-1.5 rounded-full", p.dot)} />
                  {p.label} ({countFor(p.value)})
                </button>
              ))}
            </div>
          </div>

          {tasks.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No tasks yet. Add one above to get started.
            </p>
          ) : visible.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No {filter === "all" ? "" : `${PRIORITY_LABEL[filter]} `}tasks
              right now.
            </p>
          ) : (
            <ul className="space-y-2">
              {visible.map((task) => {
                const meta = PRIORITIES.find((p) => p.value === task.priority)!;
                return (
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
                      aria-label={
                        task.done ? "Mark as not done" : "Mark as done"
                      }
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
                    <span
                      className={cn(
                        "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                        meta.badge,
                      )}
                    >
                      {meta.label}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTask(task.id)}
                      aria-label="Delete task"
                      className="size-8 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
