import React, { useState } from "react";
import { ChevronDown, CheckCircle, CalendarDays, Palette, Code, PenTool, Plus } from "lucide-react";

const TASKS = [
  {
    title: "BrightBridge – Website Design",
    subtitle: "Design a framer website with modern templates",
    icon: <Palette className="w-6 h-6 text-orange-400" />, // soft orange
    bg: "bg-orange-50"
  },
  {
    title: "AquaTech – App Launch",
    subtitle: "Prepare launch assets for mobile app",
    icon: <CalendarDays className="w-6 h-6 text-blue-400" />, // soft blue
    bg: "bg-blue-50"
  },
  {
    title: "PinkPixel – Branding Kit",
    subtitle: "Create a pastel branding kit for client",
    icon: <PenTool className="w-6 h-6 text-pink-400" />, // soft pink
    bg: "bg-pink-50"
  },
  {
    title: "GreenLeaf – SEO Audit",
    subtitle: "Run SEO audit and deliver report",
    icon: <Code className="w-6 h-6 text-green-400" />, // soft green
    bg: "bg-green-50"
  }
];

export function MyTasksSidebar() {
  const [activeTab, setActiveTab] = useState<'today' | 'tomorrow'>('today');

  return (
    <aside className="w-80 min-w-[260px] max-w-xs bg-white rounded-2xl shadow-lg flex flex-col p-6 space-y-6">
      {/* Header Row with Section Title and Add Button */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
        <button
          aria-label="Add Task"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      {/* Toggle Buttons */}
      <div className="flex space-x-2 mb-2">
        <button
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all focus:outline-none ${
            activeTab === 'today'
              ? 'bg-black text-white shadow'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => setActiveTab('today')}
        >
          Today
        </button>
        <button
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all focus:outline-none ${
            activeTab === 'tomorrow'
              ? 'bg-black text-white shadow'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => setActiveTab('tomorrow')}
        >
          Tomorrow
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex items-center mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium mr-2">
          12 Ongoing Tasks
          <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
        </span>
      </div>

      {/* Task List */}
      <div className="flex flex-col space-y-4">
        {TASKS.map((task, idx) => (
          <div
            key={task.title}
            className={`flex items-center p-4 rounded-2xl ${task.bg} transition-all group`}
          >
            <div className="mr-3 flex-shrink-0">{task.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 text-sm truncate">{task.title}</div>
              <div className="text-xs text-gray-500 mt-0.5 truncate">{task.subtitle}</div>
            </div>
            <CheckCircle className="w-6 h-6 text-green-500 ml-3 flex-shrink-0" />
          </div>
        ))}
      </div>
    </aside>
  );
}

export default MyTasksSidebar; 