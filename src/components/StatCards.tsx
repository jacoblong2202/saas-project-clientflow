import React from "react";

export function RevenueCard() {
  return (
    <div className="w-full h-1/2 min-h-[calc(50%-8px)] rounded-2xl shadow-md p-6 bg-[#4F46E5] text-white relative overflow-hidden flex flex-col justify-between">
      <span className="absolute top-4 right-4 text-lg opacity-60">↗️</span>
      <div className="text-sm font-semibold mb-2">Total Revenue</div>
      <div className="text-3xl font-extrabold mb-3">$99,560</div>
      <div className="flex items-center mb-2">
        <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full mr-2">+2.87%</span>
        <span className="text-xs opacity-80">This month vs last</span>
      </div>
    </div>
  );
}

export function SalesCard() {
  return (
    <div className="w-full h-1/2 min-h-[calc(50%-8px)] rounded-2xl shadow-md p-6 bg-[#F8F8F8] text-black relative overflow-hidden flex flex-col justify-between">
      <span className="absolute top-4 right-4 text-lg opacity-40">↗️</span>
      <div className="text-sm font-semibold mb-2">Sales</div>
      <div className="text-3xl font-extrabold mb-3">128</div>
      <div className="flex items-center mb-2">
        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full mr-2">-1.23%</span>
        <span className="text-xs opacity-70">This month vs last</span>
      </div>
    </div>
  );
} 