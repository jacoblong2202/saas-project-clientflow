"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { createBrowserClient } from '@supabase/ssr';
import {
  Loader2,
  AlertCircle,
  Paperclip,
  Send,
  User,
} from 'lucide-react';

function formatTimestamp(ts: string) {
  const date = new Date(ts);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  return date.toLocaleString();
}

export default function ProjectMessagesPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [attachment, setAttachment] = useState<string>("");
  const [client, setClient] = useState<{ name: string } | null>(null);
  const [project, setProject] = useState<{ project_name: string } | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  // Placeholder: Assume current user is agency
  const currentUser = { id: "agency-1", name: "Jacob Long", role: "agency" };

  const supabase = createBrowserClient(
    'https://mnnicdzpbfqjwtvbykry.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubmljZHpwYmZxand0dmJ5a3J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNjkyODAsImV4cCI6MjA2Nzc0NTI4MH0.G46t1BlaBAxIZ9hhpkEbUEOBqDQGASn-Poh4OS11h8o'
  );

  // Fetch project and client info
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

  // Fetch messages
  useEffect(() => {
    let ignore = false;
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('project_id', projectId)
          .order('timestamp', { ascending: true });
        if (messagesError) throw messagesError;
        if (!ignore) setMessages(messagesData || []);
      } catch (err) {
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
    // Optionally: subscribe to changes for real-time updates
    // ...
    return () => { ignore = true; };
  }, [projectId]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e: any) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setSending(true);
    const optimisticMsg = {
      id: `temp-${Date.now()}`,
      project_id: projectId,
      sender_id: currentUser.id,
      sender_name: currentUser.name,
      role: currentUser.role,
      message: newMessage,
      timestamp: new Date().toISOString(),
      attachment,
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setNewMessage("");
    setAttachment("");
    try {
      const { error: insertError } = await supabase.from('messages').insert([
        optimisticMsg
      ]);
      if (insertError) throw insertError;
    } catch (err) {
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 flex flex-col h-[80vh]">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Project Messages</h1>
        <p className="text-gray-600 text-sm mb-2">Send updates, ask questions, and collaborate on delivery.</p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="font-semibold">{project?.project_name}</span>
          <span>·</span>
          <span>Client: {client?.name}</span>
        </div>
      </div>

      {/* Message Feed */}
      <div ref={feedRef} className="flex-1 overflow-y-auto bg-gray-50 rounded-xl border p-4 shadow-sm mb-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 items-end">
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                <div className="flex-1 bg-gray-200 h-6 rounded-xl animate-pulse" />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <AlertCircle className="h-8 w-8 text-blue-400 mb-2" />
            <span className="text-gray-500 text-center">Start the conversation. Keep your client in the loop by sending updates, links, or questions.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((msg) => {
              const isAgency = msg.role === "agency";
              return (
                <div
                  key={msg.id}
                  className={`flex ${isAgency ? 'flex-row' : 'flex-row-reverse'} items-end gap-3`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isAgency ? 'bg-gray-200' : 'bg-blue-200'} text-gray-700 font-bold text-base`}>
                    <User className="h-5 w-5" />
                  </div>
                  <div className={`max-w-[70%] rounded-xl p-3 text-sm shadow-sm border ${isAgency ? 'bg-gray-100 border-gray-200' : 'bg-blue-50 border-blue-100'} flex flex-col`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800">{msg.sender_name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${isAgency ? 'bg-gray-200 text-gray-700' : 'bg-blue-200 text-blue-700'}`}>{msg.role === 'agency' ? 'Agency' : 'Client'}</span>
                      <span className="text-xs text-gray-400 ml-auto">{formatTimestamp(msg.timestamp)}</span>
                    </div>
                    <div className="whitespace-pre-line text-gray-800">{msg.message}</div>
                    {msg.attachment && (
                      <a href={msg.attachment} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center text-blue-600 hover:underline">
                        <Paperclip className="h-4 w-4 mr-1" /> Attachment
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* New Message Input */}
      <form onSubmit={handleSend} className="flex items-end gap-3 mt-auto">
        <textarea
          className="flex-1 border rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
          rows={2}
          placeholder="Type your message..."
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          disabled={sending}
        />
        <input
          type="url"
          className="border rounded px-2 py-1 text-sm w-40"
          placeholder="Attachment link (optional)"
          value={attachment}
          onChange={e => setAttachment(e.target.value)}
          disabled={sending}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition flex items-center gap-2"
          disabled={sending || !newMessage.trim()}
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Send
        </button>
      </form>
    </div>
  );
} 