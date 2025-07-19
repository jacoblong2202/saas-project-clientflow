"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createBrowserClient } from '@supabase/ssr';
import {
  Loader2,
  AlertCircle,
  Plus,
  X,
  CheckCircle,
  Clock,
  User,
  Link as LinkIcon,
} from 'lucide-react';

const STATUS_COLORS = {
  "To Do": "bg-gray-100 text-gray-700 border-gray-200",
  "In Progress": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "Done": "bg-green-100 text-green-700 border-green-200",
};

const STATUS_OPTIONS = ["To Do", "In Progress", "Done"];

export default function ProjectTasksPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<string>("All");
  const [sort, setSort] = useState<string>("due_date");
  const [newTask, setNewTask] = useState({
    name: "",
    status: "To Do",
    assignee: "Jacob Long",
    due_date: "",
    asset_link: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [client, setClient] = useState<{ name: string } | null>(null);
  const [project, setProject] = useState<{ project_name: string } | null>(null);

  const supabase = createBrowserClient(
    'https://mnnicdzpbfqjwtvbykry.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubmljZHpwYmZxand0dmJ5a3J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNjkyODAsImV4cCI6MjA2Nzc0NTI4MH0.G46t1BlaBAxIZ9hhpkEbUEOBqDQGASn-Poh4OS11h8o'
  );

  useEffect(() => {
    const fetchProjectAndClient = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data: projectData } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
        setProject(projectData);
        if (projectData) {
          const { data: clientData } = await supabase
            .from('clients')
            .select('*')
            .eq('id', projectData.client_id)
            .single();
          setClient(clientData);
        }
      } catch (err) {
        setError('Failed to load project or client info');
      }
    };
    fetchProjectAndClient();
  }, [projectId]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        let query = supabase
          .from('tasks')
          .select('*')
          .eq('project_id', projectId);
        if (filter !== "All") {
          query = query.eq('status', filter);
        }
        let { data: tasksData, error: tasksError } = await query;
        if (tasksError) throw tasksError;
        let safeTasks = tasksData ?? [];
        if (sort === "due_date") {
          safeTasks = safeTasks.sort((a: any, b: any) => (a.due_date || "") > (b.due_date || "") ? 1 : -1);
        } else if (sort === "status") {
          safeTasks = safeTasks.sort((a: any, b: any) => a.status.localeCompare(b.status));
        }
        setTasks(safeTasks);
      } catch (err) {
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [projectId, filter, sort, showModal]);

  const handleCreateTask = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error: insertError } = await supabase.from('tasks').insert([
        {
          name: newTask.name,
          status: newTask.status,
          assignee: newTask.assignee,
          due_date: newTask.due_date || null,
          asset_link: newTask.asset_link || null,
          project_id: projectId,
        },
      ]);
      if (insertError) throw insertError;
      setShowModal(false);
      setNewTask({ name: "", status: "To Do", assignee: "Jacob Long", due_date: "", asset_link: "" });
    } catch (err) {
      alert('Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Project Tasks</h1>
          <p className="text-gray-600 text-sm mb-2">Track and manage tasks for this project.</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-semibold">{project?.project_name}</span>
            <span>·</span>
            <span>Client: {client?.name}</span>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors text-sm font-medium mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4 mr-2" /> New Task
        </button>
      </div>

      {/* Filter & Sort Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex gap-2">
          {['All', ...STATUS_OPTIONS].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center ml-auto">
          <span className="text-xs text-gray-500">Sort by:</span>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <option value="due_date">Due Date</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      {/* Task List Table */}
      <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto mb-2" />
                  <span className="text-gray-500">Loading tasks...</span>
                </td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <AlertCircle className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <span className="text-gray-500">No tasks yet. Add your first task to get started!</span>
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[task.status as keyof typeof STATUS_COLORS] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>{task.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" /> {task.assignee || 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {task.asset_link ? (
                      <a href={task.asset_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:underline">
                        <LinkIcon className="h-4 w-4 mr-1" /> Asset
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* New Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Name<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  required
                  value={newTask.name}
                  onChange={e => setNewTask({ ...newTask, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={newTask.status}
                  onChange={e => setNewTask({ ...newTask, status: e.target.value })}
                >
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={newTask.assignee}
                  onChange={e => setNewTask({ ...newTask, assignee: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2"
                  value={newTask.due_date}
                  onChange={e => setNewTask({ ...newTask, due_date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asset Link</label>
                <input
                  type="url"
                  className="w-full border rounded px-3 py-2"
                  value={newTask.asset_link}
                  onChange={e => setNewTask({ ...newTask, asset_link: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
                disabled={submitting}
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" /> : null}
                Create Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 