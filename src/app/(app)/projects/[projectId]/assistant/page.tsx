"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { createBrowserClient } from '@supabase/ssr';
import {
  Loader2,
  AlertCircle,
  Bot,
  User,
  Sparkles,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';

const SUGGESTIONS = [
  "What’s blocking this project?",
  "What’s been done so far?",
  "What’s next on the timeline?",
];

export default function ProjectAssistantPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [conversation, setConversation] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<{ name: string } | null>(null);
  const [project, setProject] = useState<{ project_name: string, phase?: string, completion?: number, assigned?: string } | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  const supabase = createBrowserClient(
    'https://mnnicdzpbfqjwtvbykry.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubmljZHpwYmZxand0dmJ5a3J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNjkyODAsImV4cCI6MjA2Nzc0NTI4MH0.G46t1BlaBAxIZ9hhpkEbUEOBqDQGASn-Poh4OS11h8o'
  );

  // Fetch project and client info
  useEffect(() => {
    const fetchProjectAndClient = async () => {
      try {
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

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [conversation, loading]);

  const handleAsk = async (e?: any, question?: string) => {
    if (e) e.preventDefault();
    const q = question || input;
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    setConversation((prev) => [
      ...prev,
      { role: "user", content: q, timestamp: new Date().toISOString() },
    ]);
    setInput("");
    try {
      // Mock API call
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, projectId }),
      });
      if (!res.ok) throw new Error("AI Assistant failed");
      const data = await res.json();
      setConversation((prev) => [
        ...prev,
        { role: "assistant", content: data.answer, timestamp: new Date().toISOString() },
      ]);
    } catch (err) {
      setError("AI Assistant failed to respond. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 flex flex-col md:flex-row gap-8">
      {/* Main Assistant Area */}
      <div className="flex-1 flex flex-col">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1 flex items-center gap-2"><Bot className="h-7 w-7 text-blue-500" /> AI Assistant</h1>
          <p className="text-gray-600 text-sm mb-2">Ask questions, summarize progress, or get help with next steps.</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-semibold">{project?.project_name}</span>
            <span>·</span>
            <span>Client: {client?.name}</span>
          </div>
        </div>

        {/* Smart Suggestions */}
        <div className="flex flex-wrap gap-2 mb-4">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={s}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition"
              onClick={() => handleAsk(undefined, s)}
              disabled={loading}
            >
              {i === 0 ? <Lightbulb className="h-4 w-4" /> : i === 1 ? <Sparkles className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              {s}
            </button>
          ))}
        </div>

        {/* Conversation Thread */}
        <div ref={feedRef} className="flex-1 overflow-y-auto bg-gray-50 rounded-xl border p-4 shadow-sm mb-4 min-h-[300px] max-h-[400px]">
          {conversation.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <Bot className="h-8 w-8 text-blue-400 mb-2" />
              <span className="text-gray-500 text-center">Ask the assistant about this project, its status, or next steps.</span>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {conversation.map((msg, idx) => {
                const isUser = msg.role === "user";
                return (
                  <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-xl p-3 text-sm shadow-sm border ${isUser ? 'bg-blue-50 border-blue-200' : 'bg-gray-100 border-gray-200'} flex flex-col`}>
                      <div className="flex items-center gap-2 mb-1">
                        {isUser ? (
                          <span className="font-semibold text-blue-700 flex items-center gap-1"><User className="h-4 w-4" /> You</span>
                        ) : (
                          <span className="font-semibold text-gray-700 flex items-center gap-1"><Bot className="h-4 w-4" /> Assistant</span>
                        )}
                        <span className="text-xs text-gray-400 ml-auto">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="whitespace-pre-line text-gray-800">{msg.content}</div>
                    </div>
                  </div>
                );
              })}
              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-[70%] rounded-xl p-3 text-sm shadow-sm border bg-gray-100 border-gray-200 flex flex-col animate-pulse">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-700 flex items-center gap-1"><Bot className="h-4 w-4" /> Assistant</span>
                      <span className="text-xs text-gray-400 ml-auto">Thinking…</span>
                    </div>
                    <div className="whitespace-pre-line text-gray-500 italic">Thinking…</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {error && (
          <div className="flex items-center gap-2 text-red-600 mb-2"><AlertCircle className="h-4 w-4" /> {error}</div>
        )}
        {/* Input Box */}
        <form onSubmit={handleAsk} className="flex items-end gap-3 mt-auto">
          <textarea
            className="flex-1 border rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
            rows={2}
            placeholder="Ask the assistant…"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition flex items-center gap-2"
            disabled={loading || !input.trim()}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}
            Ask Assistant
          </button>
        </form>
      </div>
      {/* Project Context Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2"><Sparkles className="h-5 w-5 text-blue-400" /> Project Context</h3>
          <div className="text-sm text-gray-700 mb-1"><span className="font-semibold">Phase:</span> {project?.phase || 'Funnel Launch'}</div>
          <div className="text-sm text-gray-700 mb-1"><span className="font-semibold">Completion:</span> {project?.completion || 60}%</div>
          <div className="text-sm text-gray-700 mb-1"><span className="font-semibold">Assigned:</span> {project?.assigned || 'Jacob Long'}</div>
          <div className="text-sm text-gray-700 mb-1"><span className="font-semibold">Open Tasks:</span> 3</div>
        </div>
      </div>
    </div>
  );
} 