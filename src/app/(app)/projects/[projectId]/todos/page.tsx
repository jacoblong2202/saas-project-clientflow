"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, CheckCircle, Circle, FileUp, Clock, UserCheck, Sparkles } from "lucide-react";

const mockClientTodos = [
  {
    id: 1,
    title: "Upload branding kit",
    status: "pending",
    due: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    updated: new Date(Date.now() - 1000 * 60 * 60 * 2),
    description: "Please upload your latest brand assets.",
  },
  {
    id: 2,
    title: "Approve homepage copy",
    status: "completed",
    due: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    updated: new Date(Date.now() - 1000 * 60 * 60 * 24),
    description: "Review and approve the homepage text.",
  },
];

const mockAgencyAwaiting = [
  {
    id: 1,
    description: "Waiting on logo approval",
    status: "Needs client action",
    assigned: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    tag: "bg-yellow-100 text-yellow-700",
  },
  {
    id: 2,
    description: "Waiting on file upload for About page",
    status: "Follow-up sent",
    assigned: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    tag: "bg-blue-100 text-blue-700",
  },
];

function relativeTime(date: Date) {
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
}

export default function ProjectTodosPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<any>(null);
  const [clientTodos, setClientTodos] = useState<Array<{
    id: number;
    title: string;
    status: string;
    due: Date | null;
    updated: Date;
    description: string;
  }>>(mockClientTodos.map(t => ({ ...t, due: t.due ?? null })));
  const [agencyAwaiting, setAgencyAwaiting] = useState(mockAgencyAwaiting);
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("all");
  const [newTodo, setNewTodo] = useState({ title: "", due: "", description: "" });
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setProject({ name: "Acme Website Redesign", client: { name: "Acme Corp" } });
    }, 300);
  }, [projectId]);

  const filteredTodos = clientTodos.filter((t) =>
    filter === "all" ? true : filter === "pending" ? t.status === "pending" : t.status === "completed"
  );

  const handleToggle = (id: number) => {
    setClientTodos((todos) =>
      todos.map((t) =>
        t.id === id ? { ...t, status: t.status === "pending" ? "completed" : "pending", updated: new Date() } : t
      )
    );
    setSuccessMsg("Marked as complete!");
    setTimeout(() => setSuccessMsg(""), 1500);
  };

  const handleAdd = (e: any) => {
    e.preventDefault();
    setClientTodos((todos) => [
      {
        id: Math.random(),
        title: newTodo.title,
        status: "pending",
        due: newTodo.due ? new Date(newTodo.due) : null,
        updated: new Date(),
        description: newTodo.description,
      },
      ...todos,
    ]);
    setShowAdd(false);
    setNewTodo({ title: "", due: "", description: "" });
    setSuccessMsg("To-Do added!");
    setTimeout(() => setSuccessMsg(""), 1500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex flex-wrap items-center gap-2">
          To-Dos & Approvals
          {project && (
            <span className="text-lg font-normal text-gray-500 ml-2">
              | {project.name} <span className="text-gray-400">/</span> {project.client.name}
            </span>
          )}
        </h1>
        <p className="text-gray-600 mt-2">
          See what’s pending on both sides to keep this project moving.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'completed'].map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="mb-4 text-green-600 font-medium transition-all">{successMsg}</div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Client To-Dos */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">Client To-Dos</h2>
            <Button size="sm" onClick={() => setShowAdd(true)}>
              <Plus className="w-4 h-4 mr-1" /> Add Client To-Do
            </Button>
          </div>
          <Card className="bg-white rounded-lg shadow-sm p-4">
            {filteredTodos.length === 0 ? (
              <div className="text-gray-400 py-8 text-center">
                You’ve got a clear runway! No pending items.
              </div>
            ) : (
              <ul className="divide-y">
                {filteredTodos.map((todo) => (
                  <li key={todo.id} className="flex items-center justify-between py-3 group transition">
                    <div className="flex items-center gap-3">
                      <button
                        className={cn(
                          "rounded-full border w-6 h-6 flex items-center justify-center transition",
                          todo.status === "completed"
                            ? "bg-green-100 border-green-400 text-green-600"
                            : "bg-white border-gray-300 text-gray-400 hover:bg-gray-50"
                        )}
                        onClick={() => handleToggle(todo.id)}
                        aria-label="Toggle complete"
                      >
                        {todo.status === "completed" ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      </button>
                      <div>
                        <div className={cn("font-medium text-sm", todo.status === "completed" && "line-through text-gray-400")}>{todo.title}</div>
                        <div className="text-xs text-gray-500">{todo.description}</div>
                        <div className="flex gap-2 mt-1 text-xs text-gray-400">
                          {todo.due && <span><Clock className="inline w-4 h-4 mr-1" />Due {todo.due.toLocaleDateString()}</span>}
                          <span>Last updated {relativeTime(todo.updated)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      {todo.status === "pending" && (
                        <Button size="icon" variant="ghost" title="Submit File">
                          <FileUp className="w-4 h-4" />
                        </Button>
                      )}
                      {todo.status === "pending" && (
                        <Button size="sm" variant="outline" onClick={() => handleToggle(todo.id)}>
                          Mark as Complete
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* Agency Awaiting */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold mb-2">Agency Awaiting</h2>
          <Card className="bg-white rounded-lg shadow-sm p-4">
            {agencyAwaiting.length === 0 ? (
              <div className="text-gray-400 py-8 text-center">
                Nothing pending from the client.
              </div>
            ) : (
              <ul className="divide-y">
                {agencyAwaiting.map((item) => (
                  <li key={item.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <UserCheck className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="font-medium text-sm">{item.description}</div>
                        <div className="flex gap-2 mt-1 text-xs text-gray-400">
                          <span>Assigned {item.assigned.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <span className={cn("px-2 py-1 text-xs font-medium rounded", item.tag)}>{item.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* AI Assistant Nudge */}
          <Card className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded flex items-center gap-3 mt-4">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <div className="flex-1">
              <div className="font-semibold text-blue-700 mb-1">AI Assistant</div>
              <div className="text-gray-700 text-sm mb-2">Suggest next client task?</div>
              <Button size="sm" variant="outline" disabled>
                Let AI suggest a task based on project progress
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Add To-Do Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Client To-Do</h3>
            <form className="flex flex-col gap-3" onSubmit={handleAdd}>
              <div>
                <label className="block text-sm font-medium mb-1">Task Title</label>
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1"
                  value={newTodo.title}
                  onChange={e => setNewTodo(t => ({ ...t, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Due Date (optional)</label>
                <input
                  type="date"
                  className="w-full border rounded px-2 py-1"
                  value={newTodo.due}
                  onChange={e => setNewTodo(t => ({ ...t, due: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description/Notes</label>
                <textarea
                  className="w-full border rounded px-2 py-1"
                  value={newTodo.description}
                  onChange={e => setNewTodo(t => ({ ...t, description: e.target.value }))}
                  rows={2}
                />
              </div>
              <div className="flex gap-2 mt-2">
                <Button type="submit" size="sm">Add To-Do</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 