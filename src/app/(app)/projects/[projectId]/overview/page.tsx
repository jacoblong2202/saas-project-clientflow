"use client";

import { useState } from "react";
import { Bell, Search, UserCircle, ArrowUpRight, TrendingUp, ShoppingBag, Shirt, Watch, PieChart, BarChart2, BadgeCheck, User, ChevronDown, ChevronUp, CreditCard, Cog, Home, RefreshCw, Eye, Sliders } from "lucide-react";

const sidebarItems = [
  { label: "Overview", icon: Home },
  { label: "Updates", icon: RefreshCw },
  { label: "Payment", icon: CreditCard },
  { label: "My Order", icon: ShoppingBag },
];

const topNavTabs = [
  "Dashboard",
  "Order",
  "Account",
  "Payments",
  "Settings",
];

const user = {
  name: "Romaria Sakura",
  email: "romaria.skra@gmail.com",
};

const mainCards = [
  {
    title: "Sales Revenue",
    value: "45K",
    cta: "See Details",
    style: "white",
  },
  {
    title: "Today Received",
    value: "$234,890",
    subtext: "12% ↑",
    style: "dark",
  },
  {
    title: "Sales Total (weekly)",
    type: "bar",
    data: [12, 18, 10, 22, 16, 24, 20],
    style: "light",
  },
  {
    title: "Top Product",
    type: "dot",
    categories: ["Fashion", "Other"],
    value: "64",
    trend: "+34%",
  },
  {
    title: "Top Item Sales",
    tags: ["Top Item"],
    icons: [Shirt, Watch, ShoppingBag],
    style: "white",
  },
  {
    title: "Cost Breakdown",
    value: "$594",
    type: "donut",
    subtext: "Marketing Budget",
    trend: "+49%",
  },
  {
    title: "Top Market Demand",
    type: "bar-tabs",
    customer: "Gilbert K",
    categories: ["Home", "Fashion", "Shoes", "Skincare", "Food"],
    selected: "Fashion",
    stat: "23%",
    style: "wide",
  },
];

function BarChart({ data }: { data: number[] }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1 h-16 w-full">
      {data.map((v, i) => (
        <div key={i} className="flex-1 bg-purple-200 rounded-t-xl" style={{ height: `${(v / max) * 100}%` }} />
      ))}
    </div>
  );
}

function DonutChart({ value = 70 }: { value?: number }) {
  // Simple static donut chart
  const radius = 24;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const percent = value;
  const strokeDashoffset = circumference - (percent / 100) * circumference;
  return (
    <svg height={radius * 2} width={radius * 2} className="block mx-auto">
      <circle
        stroke="#ede9fe"
        fill="white"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#a78bfa"
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset, transition: "stroke-dashoffset 0.5s" }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        className="font-bold text-md fill-purple-700"
      >
        {percent}%
      </text>
    </svg>
  );
}

export default function PremiumDashboard() {
  const [selectedTab, setSelectedTab] = useState("Fashion");
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 px-6 py-8">
      <header className="w-full bg-white border-b px-6 py-4 mb-8">
        <div className="max-w-7xl mx-auto flex items-center">
          <h1 className="text-2xl font-bold text-purple-800">Project Dashboard</h1>
        </div>
      </header>
      <div className="max-w-7xl mx-auto">
        {/* Find the main navbar (the one with the page tabs) */}
        {/* Add sticky positioning and z-index */}
        {/* Remove the mini navbar with the page tabs (Dashboard, Order, Account, Payments, Settings) */}
        {/* Just keep the main dashboard content and cards */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sales Revenue Card */}
          <div className="col-span-12 md:col-span-4 bg-white rounded-2xl shadow-neumorph p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-700">Sales Revenue</span>
              <ArrowUpRight className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-extrabold text-purple-800 mb-2">45K</div>
            <button className="mt-auto text-sm text-purple-600 font-semibold hover:underline">See Details</button>
          </div>
          {/* Today Received Card */}
          <div className="col-span-12 md:col-span-4 bg-gradient-to-br from-purple-600 to-purple-400 rounded-2xl shadow-neumorph p-6 text-white flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Today Received</span>
              <TrendingUp className="w-5 h-5 text-white/80" />
            </div>
            <div className="text-3xl font-extrabold mb-2">$234,890</div>
            <div className="flex items-center gap-2 text-green-200 font-semibold text-sm">
              <ChevronUp className="w-4 h-4" /> 12% ↑
            </div>
          </div>
          {/* Sales Total (weekly) Card */}
          <div className="col-span-12 md:col-span-4 bg-white rounded-2xl shadow-neumorph p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-700">Sales Total (weekly)</span>
              <BarChart2 className="w-5 h-5 text-purple-400" />
            </div>
            <BarChart data={[12, 18, 10, 22, 16, 24, 20]} />
          </div>
          {/* Top Product Card */}
          <div className="col-span-12 md:col-span-3 bg-white rounded-2xl shadow-neumorph p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-700">Top Product</span>
              <BadgeCheck className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl font-bold text-purple-800">64</span>
              <span className="text-xs text-green-600 font-semibold">+34%</span>
            </div>
            <div className="flex gap-2 mt-auto">
              <span className="inline-block w-2 h-2 rounded-full bg-purple-400" />
              <span className="inline-block w-2 h-2 rounded-full bg-gray-300" />
              <span className="text-xs text-gray-400">Fashion vs Other</span>
            </div>
          </div>
          {/* Top Item Sales Card */}
          <div className="col-span-12 md:col-span-3 bg-white rounded-2xl shadow-neumorph p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-700">Top Item Sales</span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold"><BadgeCheck className="w-4 h-4" /> Top Item</span>
            </div>
            <div className="flex gap-3 mt-2">
              <Shirt className="w-7 h-7 text-purple-400" />
              <Watch className="w-7 h-7 text-purple-400" />
              <ShoppingBag className="w-7 h-7 text-purple-400" />
            </div>
          </div>
          {/* Cost Breakdown Card */}
          <div className="col-span-12 md:col-span-3 bg-white rounded-2xl shadow-neumorph p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-700">Cost Breakdown</span>
              <PieChart className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl font-bold text-purple-800">$594</span>
              <span className="text-xs text-green-600 font-semibold">+49%</span>
            </div>
            <DonutChart value={70} />
            <div className="text-xs text-gray-400 mt-2">Marketing Budget</div>
          </div>
          {/* Top Market Demand Card (wide) */}
          <div className="col-span-12 md:col-span-6 bg-white rounded-2xl shadow-neumorph p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-700">Top Market Demand</span>
              <Sliders className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex gap-2 mb-2">
              {["Home", "Fashion", "Shoes", "Skincare", "Food"].map(cat => (
                <button
                  key={cat}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${selectedTab === cat ? "bg-purple-600 text-white border-purple-600" : "bg-white text-purple-700 border-purple-200 hover:bg-purple-50"}`}
                  onClick={() => setSelectedTab(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-2">
              <User className="w-7 h-7 text-purple-400" />
              <span className="font-semibold text-gray-700">Gilbert K</span>
              <span className="ml-auto text-2xl font-bold text-purple-800">23%</span>
            </div>
            <BarChart data={[8, 12, 16, 10, 14, 18, 12]} />
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button className="px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold shadow hover:bg-purple-700 transition flex items-center gap-2">
            <RefreshCw className="w-5 h-5" /> Restart Data
          </button>
          <button className="px-6 py-3 rounded-xl bg-white text-purple-700 font-semibold shadow border border-purple-200 hover:bg-purple-50 transition flex items-center gap-2">
            <Eye className="w-5 h-5" /> View All
          </button>
          <button className="px-6 py-3 rounded-xl bg-white text-purple-700 font-semibold shadow border border-purple-200 hover:bg-purple-50 transition flex items-center gap-2">
            <Sliders className="w-5 h-5" /> View Customize
          </button>
        </div>
      </div>
    </div>
  );
}

// Tailwind custom shadow for neumorphism
// .shadow-neumorph { box-shadow: 0 4px 24px 0 rgba(80, 63, 205, 0.08), 0 1.5px 4px 0 rgba(80, 63, 205, 0.04); } 