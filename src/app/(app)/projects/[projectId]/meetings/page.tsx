"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Dummy fetch functions (replace with real Supabase calls)
const fetchProject = async (projectId: string) => {
  // Replace with Supabase fetch
  return {
    name: "Acme Website Redesign",
    client: { name: "Acme Corp" },
  };
};

const fetchUpcomingMeeting = async (projectId: string) => {
  // Replace with Supabase fetch
  return {
    id: "1",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    type: "Strategy Call",
    joinUrl: "https://zoom.us/j/123456789",
    status: "Confirmed",
    rescheduleUrl: "https://calendly.com/agency/strategy-call",
  };
};

const fetchPastMeetings = async (projectId: string) => {
  // Replace with Supabase fetch
  return [
    {
      id: "2",
      type: "Kickoff Call",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      duration: "45 min",
      notes: "Discussed project goals and deliverables.",
    },
    {
      id: "3",
      type: "Design Review",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      duration: "30 min",
      notes: "Reviewed homepage wireframes.",
    },
  ];
};

const meetingStatusColor = {
  Confirmed: "bg-green-100 text-green-700",
  Rescheduled: "bg-yellow-100 text-yellow-700",
  Pending: "bg-gray-100 text-gray-700",
};

export default function MeetingsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<any>(null);
  const [upcoming, setUpcoming] = useState<any | null>(null);
  const [past, setPast] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [showManualForm, setShowManualForm] = useState(false);
  const [form, setForm] = useState({
    date: "",
    time: "",
    type: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchProject(projectId),
      fetchUpcomingMeeting(projectId),
      fetchPastMeetings(projectId),
    ])
      .then(([proj, up, pastMeetings]) => {
        setProject(proj);
        setUpcoming(up);
        setPast(pastMeetings);
      })
      .catch(() => setError("Failed to load meetings."))
      .finally(() => setLoading(false));
  }, [projectId]);

  const handleFormChange = (e: any) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleManualSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    // Replace with Supabase insert
    setTimeout(() => {
      setSaving(false);
      setShowManualForm(false);
      setPast((p) =>
        p
          ? [
              {
                id: Math.random().toString(),
                type: form.type,
                date: new Date(form.date + "T" + form.time),
                duration: "--",
                notes: form.notes,
              },
              ...p,
            ]
          : []
      );
      setForm({ date: "", time: "", type: "", notes: "" });
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex flex-wrap items-center gap-2">
          Meetings & Calls
          {project && (
            <span className="text-lg font-normal text-gray-500 ml-2">
              | {project.name} <span className="text-gray-400">/</span> {project.client.name}
            </span>
          )}
        </h1>
        <p className="text-gray-600 mt-2">
          See upcoming sessions, join links, and past meeting notes.
        </p>
      </div>

      {/* Layout: Upcoming + History */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Upcoming Meeting Card */}
        <div className="md:w-1/2 flex flex-col gap-6">
          <Card className="p-6 rounded-xl shadow hover:bg-gray-50 transition">
            <h2 className="text-xl font-semibold mb-2">Upcoming Meeting</h2>
            {loading ? (
              <div className="h-24 w-full rounded bg-gray-100 animate-pulse" />
            ) : upcoming ? (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">
                    {new Date(upcoming.date).toLocaleString(undefined, { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </span>
                  <span
                    className={cn(
                      "ml-2 px-2 py-1 text-xs font-medium rounded-full",
                      meetingStatusColor[upcoming.status as keyof typeof meetingStatusColor] ||
                        "bg-gray-100 text-gray-700"
                    )}
                  >
                    {upcoming.status}
                  </span>
                </div>
                <div className="text-gray-700 mb-2">{upcoming.type}</div>
                <div className="flex gap-2 mt-2">
                  <Button asChild size="sm">
                    <a href={upcoming.joinUrl} target="_blank" rel="noopener noreferrer">
                      Join Meeting
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(upcoming.rescheduleUrl, "_blank")}
                  >
                    Reschedule
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 flex flex-col gap-2">
                <span>No upcoming meetings. Use the link below to schedule one.</span>
              </div>
            )}
          </Card>

          {/* Schedule a Meeting */}
          <Card className="p-6 rounded-xl shadow hover:bg-gray-50 transition">
            <h2 className="text-lg font-semibold mb-2">Schedule a Meeting</h2>
            {/* Calendly embed or manual form toggle */}
            <div className="mb-4">
              <Button
                size="sm"
                onClick={() => setShowManualForm((v) => !v)}
                variant={showManualForm ? "outline" : "default"}
              >
                {showManualForm ? "Schedule via Calendly" : "Schedule Manually"}
              </Button>
            </div>
            {showManualForm ? (
              <form className="flex flex-col gap-3" onSubmit={handleManualSubmit}>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleFormChange}
                    className="w-full border rounded px-2 py-1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleFormChange}
                    className="w-full border rounded px-2 py-1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Meeting Type</label>
                  <input
                    type="text"
                    name="type"
                    value={form.type}
                    onChange={handleFormChange}
                    className="w-full border rounded px-2 py-1"
                    placeholder="e.g. Strategy Call"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleFormChange}
                    className="w-full border rounded px-2 py-1"
                    rows={2}
                  />
                </div>
                <Button type="submit" size="sm" disabled={saving}>
                  {saving ? "Saving..." : "Save Meeting"}
                </Button>
                {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
              </form>
            ) : (
              <div className="flex flex-col gap-2">
                {/* Calendly embed (replace with real embed if desired) */}
                <Button asChild size="sm">
                  <a
                    href="https://calendly.com/agency/strategy-call"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Schedule via Calendly
                  </a>
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Past Meetings Table */}
        <div className="md:w-1/2 flex flex-col gap-6">
          <Card className="p-6 rounded-xl shadow hover:bg-gray-50 transition">
            <h2 className="text-xl font-semibold mb-4">Meeting History</h2>
            {loading ? (
              <div className="h-32 w-full rounded bg-gray-100 animate-pulse" />
            ) : past && past.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 text-xs border-b">
                      <th className="py-2 pr-4 text-left">Type</th>
                      <th className="py-2 pr-4 text-left">Date</th>
                      <th className="py-2 pr-4 text-left">Duration</th>
                      <th className="py-2 pr-4 text-left">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {past.map((m) => (
                      <tr key={m.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 pr-4 font-medium">{m.type}</td>
                        <td className="py-2 pr-4">
                          {new Date(m.date).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </td>
                        <td className="py-2 pr-4">{m.duration || "--"}</td>
                        <td className="py-2 pr-4 max-w-xs truncate">
                          {m.notes ? (
                            <span title={m.notes}>{m.notes}</span>
                          ) : (
                            <span className="text-gray-400">--</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-gray-500">
                No meetings logged yet. Once you’ve had your first session, notes will appear here.
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
} 