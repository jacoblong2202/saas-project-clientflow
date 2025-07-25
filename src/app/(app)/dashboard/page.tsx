"use client";
import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Settings, CheckCircle, User, CreditCard, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const barData = [
  { name: "1 AUG", value: 20000 },
  { name: "2 AUG", value: 12000 },
  { name: "3 AUG", value: 14000 },
  { name: "4 AUG", value: 18000 },
  { name: "5 AUG", value: 23000 },
  { name: "6 AUG", value: 25000 },
  { name: "7 AUG", value: 21000 },
];

const doughnutData = [
  { name: "Apple MacBook Air M2", value: 25, color: "#4F46E5" },
  { name: "Apple Watch Series 9", value: 20, color: "#22D3EE" },
  { name: "Acoustics JBL Charge 5", value: 18, color: "#FBBF24" },
  { name: "Acoustics Divoom SongBird-HQ", value: 22, color: "#10B981" },
  { name: "Apple AirPods Pro 2", value: 15, color: "#EF4444" },
];

const statCards = [
  {
    title: "Total revenue",
    value: "$99,560",
    change: "+2.87%",
    changeColor: "green",
    bgColor: "bg-[#4F46E5]",
    textColor: "text-white",
    subtext: "This month vs last",
  },
  {
    title: "Total orders",
    value: "35",
    change: "-2.1%",
    changeColor: "red",
    bgColor: "bg-white",
    textColor: "text-black",
    subtext: "This month vs last",
  },
  {
    title: "Total visitors",
    value: "45,600",
    change: "-2.45%",
    changeColor: "red",
    bgColor: "bg-white",
    textColor: "text-black",
    subtext: "This month vs last",
  },
  {
    title: "Net profit",
    value: "$60,450",
    change: "+1.56%",
    changeColor: "green",
    bgColor: "bg-white",
    textColor: "text-black",
    subtext: "This month vs last",
  },
];

const miniCards = [
  {
    value: "98",
    title: "orders",
    subtext: "12 orders are awaiting confirmation.",
    icon: <CheckCircle className="w-6 h-6 text-green-500" />,
  },
  {
    value: "17",
    title: "customers",
    subtext: "17 customers are waiting for response.",
    icon: <User className="w-6 h-6 text-blue-500" />,
  },
];

const chartColors = ["#4F46E5", "#22D3EE", "#FBBF24", "#10B981", "#EF4444"];

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState("This month");
  const [stripeAccount, setStripeAccount] = useState<any>(null);
  const [stripeBalance, setStripeBalance] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user has connected Stripe account
  useEffect(() => {
    checkStripeConnection();
  }, []);

  const checkStripeConnection = async () => {
    try {
      // Check if user has a stored Stripe account ID
      const accountId = localStorage.getItem('stripeAccountId');
      if (accountId) {
        const response = await fetch(`/api/stripe/account/${accountId}`);
        if (response.ok) {
          const data = await response.json();
          setStripeAccount(data.account);
          setStripeBalance(data.balance);
        }
      }
    } catch (error) {
      console.error('Error checking Stripe connection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectStripe = async () => {
    setIsConnecting(true);
    try {
      const response = await fetch('/api/stripe/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'user@example.com', // Replace with actual user email
          country: 'US'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store the account ID
        localStorage.setItem('stripeAccountId', data.accountId);
        // Redirect to Stripe onboarding
        window.location.href = data.accountLink;
      } else {
        console.error('Failed to create Stripe account');
      }
    } catch (error) {
      console.error('Error connecting Stripe:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const openStripeDashboard = () => {
    if (stripeAccount?.id) {
      // Open Stripe Express Dashboard
      window.open(`https://dashboard.stripe.com/express/${stripeAccount.id}`, '_blank');
    }
  };

  // Update stat cards with real Stripe data
  const getRealTimeStats = () => {
    if (!stripeBalance) return statCards;

    const available = stripeBalance.available?.[0]?.amount || 0;
    const pending = stripeBalance.pending?.[0]?.amount || 0;
    const total = available + pending;

    return [
      {
        title: "Available Balance",
        value: `$${(available / 100).toFixed(2)}`,
        change: "+0%",
        changeColor: "green",
        bgColor: "bg-[#4F46E5]",
        textColor: "text-white",
        subtext: "Ready for payout",
      },
      {
        title: "Pending Balance",
        value: `$${(pending / 100).toFixed(2)}`,
        change: "+0%",
        changeColor: "green",
        bgColor: "bg-white",
        textColor: "text-black",
        subtext: "Processing payments",
      },
      {
        title: "Total Revenue",
        value: `$${(total / 100).toFixed(2)}`,
        change: "+0%",
        changeColor: "green",
        bgColor: "bg-white",
        textColor: "text-black",
        subtext: "All time",
      },
      {
        title: "Account Status",
        value: stripeAccount?.charges_enabled ? "Active" : "Pending",
        change: stripeAccount?.charges_enabled ? "✓" : "⏳",
        changeColor: stripeAccount?.charges_enabled ? "green" : "yellow",
        bgColor: "bg-white",
        textColor: "text-black",
        subtext: stripeAccount?.charges_enabled ? "Ready to accept payments" : "Complete onboarding",
      },
    ];
  };

  return (
    <div className="min-h-screen bg-[#f9fafe] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Header */}
          <div className="col-span-1 md:col-span-2 xl:col-span-4 flex flex-col md:flex-row md:items-center md:justify-between bg-white rounded-2xl p-6 mb-2 shadow-sm">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl font-bold">Hello, Barbara! 👋</span>
                <Settings className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-gray-500 text-base">This is what's happening in your store this month.</div>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <select
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none shadow-sm"
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}
              >
                <option>This month</option>
                <option>Last month</option>
              </select>
              
              {/* Stripe Connect Button */}
              {!stripeAccount ? (
                <Button 
                  onClick={connectStripe} 
                  disabled={isConnecting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {isConnecting ? 'Connecting...' : 'Connect Stripe'}
                </Button>
              ) : (
                <Button 
                  onClick={openStripeDashboard}
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Stripe Dashboard
                </Button>
              )}
            </div>
          </div>

          {/* Stat Cards */}
          {getRealTimeStats().map((card, i) => (
            <div
              key={card.title}
              className={`rounded-2xl shadow-sm p-6 flex flex-col gap-2 ${card.bgColor} ${card.textColor}`}
            >
              <div className="text-base font-semibold mb-1">{card.title}</div>
              <div className="text-3xl font-extrabold mb-1">{card.value}</div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${card.changeColor === "green" ? "bg-green-100 text-green-700" : card.changeColor === "yellow" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{card.change}</span>
                <span className="text-xs text-gray-200 md:text-gray-400">{card.subtext}</span>
              </div>
            </div>
          ))}

          {/* Revenue Bar Chart */}
          <div className="col-span-1 md:col-span-2 bg-white rounded-2xl shadow-sm p-6 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-base">Revenue</div>
              <div className="text-xs text-gray-400">This month vs last</div>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4F46E5" radius={[8, 8, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Mini Stat Cards */}
          {miniCards.map((card, i) => (
            <div key={card.title} className="rounded-2xl shadow-sm p-6 bg-white flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-bold">{card.value}</span>
                {card.icon}
              </div>
              <div className="text-base font-semibold mb-1 capitalize">{card.title}</div>
              <div className="text-xs text-gray-400">{card.subtext}</div>
            </div>
          ))}

          {/* Doughnut Chart */}
          <div className="col-span-1 md:col-span-2 bg-white rounded-2xl shadow-sm p-6 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-base">Sales by Category</div>
              <div className="text-xs text-gray-400">This month vs last</div>
            </div>
            <div className="flex flex-col items-center justify-center w-full gap-2">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie
                    data={doughnutData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {doughnutData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                {doughnutData.map((entry, idx) => (
                  <div key={entry.name} className="flex items-center gap-2 text-xs">
                    <span className="inline-block w-3 h-3 rounded-full" style={{ background: entry.color }}></span>
                    <span className="text-gray-600 whitespace-nowrap">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 