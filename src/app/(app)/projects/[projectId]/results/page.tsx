"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createBrowserClient } from '@supabase/ssr';
import {
  Loader2,
  AlertCircle,
  Mail,
  BarChart2,
  TrendingUp,
  DollarSign,
  Users,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';

const KPI_CARDS = [
  {
    label: "Total Leads",
    value: 213,
    icon: Mail,
    change: "+18%",
    changeColor: "text-green-600",
    sub: "from last month",
  },
  {
    label: "Revenue",
    value: "£4,920",
    icon: DollarSign,
    change: "+12%",
    changeColor: "text-green-600",
    sub: "from last month",
  },
  {
    label: "Conversion Rate",
    value: "3.7%",
    icon: TrendingUp,
    change: "+0.4%",
    changeColor: "text-green-600",
    sub: "from last month",
  },
  {
    label: "Traffic Volume",
    value: "12,000",
    icon: BarChart2,
    change: "-2%",
    changeColor: "text-red-600",
    sub: "from last month",
  },
];

const LEADS_DATA = [
  { date: "Mon", leads: 20 },
  { date: "Tue", leads: 32 },
  { date: "Wed", leads: 28 },
  { date: "Thu", leads: 40 },
  { date: "Fri", leads: 35 },
  { date: "Sat", leads: 25 },
  { date: "Sun", leads: 33 },
];

const REVENUE_DATA = [
  { month: "Jan", revenue: 1200 },
  { month: "Feb", revenue: 1800 },
  { month: "Mar", revenue: 2100 },
  { month: "Apr", revenue: 1700 },
  { month: "May", revenue: 2300 },
  { month: "Jun", revenue: 2500 },
];

const BREAKDOWN = [
  { source: "Google Ads", clicks: 1200, optins: 300, conversions: 45, revenue: 900 },
  { source: "Facebook", clicks: 900, optins: 210, conversions: 32, revenue: 700 },
  { source: "Email", clicks: 400, optins: 120, conversions: 18, revenue: 320 },
  { source: "Organic", clicks: 800, optins: 200, conversions: 28, revenue: 600 },
];

export default function ProjectResultsPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [client, setClient] = useState<{ name: string } | null>(null);
  const [project, setProject] = useState<{ project_name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("7d");

  const supabase = createBrowserClient(
    'https://mnnicdzpbfqjwtvbykry.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubmljZHpwYmZxand0dmJ5a3J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNjkyODAsImV4cCI6MjA2Nzc0NTI4MH0.G46t1BlaBAxIZ9hhpkEbUEOBqDQGASn-Poh4OS11h8o'
  );

  useEffect(() => {
    const fetchProjectAndClient = async () => {
      try {
        setLoading(true);
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
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchProjectAndClient();
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading results…</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Results & KPIs</h1>
        <p className="text-gray-600 text-sm mb-2">Track campaign performance, revenue, and lead generation.</p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="font-semibold">{project?.project_name}</span>
          <span>·</span>
          <span>Client: {client?.name}</span>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {KPI_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 border hover:shadow-md transition">
              <div className="flex items-center gap-2 mb-1">
                <Icon className="h-6 w-6 text-blue-500" />
                <span className="text-lg font-bold text-gray-900">{card.value}</span>
              </div>
              <div className="text-gray-700 font-semibold">{card.label}</div>
              <div className="flex items-center gap-2 text-xs">
                <span className={card.changeColor}>{card.change}</span>
                <span className="text-gray-400">{card.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow p-6 border">
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold text-gray-900">Leads Over Time</div>
            <div className="flex gap-2">
              <button onClick={() => setRange("7d")} className={`px-2 py-1 rounded text-xs font-medium ${range === "7d" ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}>7d</button>
              <button onClick={() => setRange("30d")} className={`px-2 py-1 rounded text-xs font-medium ${range === "30d" ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}>30d</button>
              <button onClick={() => setRange("all")} className={`px-2 py-1 rounded text-xs font-medium ${range === "all" ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}>All</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={LEADS_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="leads" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border">
          <div className="font-bold text-gray-900 mb-2">Monthly Revenue</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI-Generated Summary Box */}
      <div className="bg-gray-50 border-l-4 border-blue-500 p-4 rounded mb-8 italic text-gray-800">
        <div className="font-bold text-blue-700 mb-1">AI Summary</div>
        You generated £2.3K in the last 30 days. That’s a 27% increase from last month.
      </div>

      {/* Detailed Breakdown Table */}
      <div className="bg-white rounded-xl shadow p-6 border overflow-x-auto">
        <div className="font-bold text-gray-900 mb-2">Detailed Breakdown</div>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">Source</th>
              <th className="px-4 py-2 text-left">Clicks</th>
              <th className="px-4 py-2 text-left">Opt-ins</th>
              <th className="px-4 py-2 text-left">Conversions</th>
              <th className="px-4 py-2 text-left">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {BREAKDOWN.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">No KPIs have been recorded yet. Once traffic or leads are collected, stats will show here.</td>
              </tr>
            ) : (
              BREAKDOWN.map((row, i) => (
                <tr key={row.source} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-2 font-semibold">{row.source}</td>
                  <td className="px-4 py-2">{row.clicks}</td>
                  <td className="px-4 py-2">{row.optins}</td>
                  <td className="px-4 py-2">{row.conversions}</td>
                  <td className="px-4 py-2">£{row.revenue}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 