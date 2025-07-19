"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const getCurrentMonth = () => {
  return new Date().toLocaleString(undefined, { month: "long", year: "numeric" });
};

const dummySummary = {
  tasksCompleted: 18,
  milestonesHit: { done: 3, total: 5 },
  results: { leads: 153, revenue: 4200 },
  timeInvested: 23,
  lastUpdated: new Date(),
};

const whatWasDone = [
  "Delivered onboarding assets to client portal",
  "Set up automations for lead capture",
  "Launched new funnel for Q3 campaign",
  "Refined onboarding process for new clients",
  "Shared creative drafts and final deliverables",
];

const resultsFromIt = [
  "153 leads captured via landing page",
  "Landing page conversion rate: 18.2%",
  "£4.2K revenue generated from new funnel",
  "2 new client signups from referral program",
];

export default function ProjectSummaryPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with real fetch
    setTimeout(() => {
      setProject({
        name: "Acme Website Redesign",
        client: { name: "Acme Corp" },
      });
      setLoading(false);
    }, 500);
  }, [projectId]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex flex-wrap items-center gap-2">
          Retainer Summary
          {project && (
            <span className="text-lg font-normal text-gray-500 ml-2">
              | {project.name} <span className="text-gray-400">/</span> {project.client.name}
            </span>
          )}
        </h1>
        <p className="text-gray-600 mt-2">
          Here’s a monthly breakdown of what was done and what it achieved.
        </p>
        <div className="text-sm text-gray-400 mt-1">
          {getCurrentMonth()}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 flex flex-col items-start bg-white rounded shadow">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block bg-blue-100 text-blue-600 rounded-full p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </span>
            <span className="text-lg font-semibold">{dummySummary.tasksCompleted}</span>
          </div>
          <div className="text-gray-500 text-sm">Tasks Done</div>
        </Card>
        <Card className="p-4 flex flex-col items-start bg-white rounded shadow">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block bg-green-100 text-green-600 rounded-full p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
            </span>
            <span className="text-lg font-semibold">{dummySummary.milestonesHit.done}/{dummySummary.milestonesHit.total}</span>
          </div>
          <div className="text-gray-500 text-sm">Milestones Hit</div>
        </Card>
        <Card className="p-4 flex flex-col items-start bg-white rounded shadow">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block bg-yellow-100 text-yellow-600 rounded-full p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2z" /></svg>
            </span>
            <span className="text-lg font-semibold">{dummySummary.results.leads} leads</span>
          </div>
          <div className="text-gray-500 text-sm">Results Generated</div>
        </Card>
        <Card className="p-4 flex flex-col items-start bg-white rounded shadow">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block bg-purple-100 text-purple-600 rounded-full p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0V4m0 16v-4" /></svg>
            </span>
            <span className="text-lg font-semibold">{dummySummary.timeInvested}h</span>
          </div>
          <div className="text-gray-500 text-sm">Time Invested</div>
        </Card>
      </div>

      {/* What Was Done */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">What Was Done</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          {whatWasDone.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Results That Came From It */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Results That Came From It</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          {resultsFromIt.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        {/* Placeholder for charts if tracked */}
        <div className="mt-4">
          <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center text-gray-400">
            [Charts coming soon]
          </div>
        </div>
      </div>

      {/* AI-Generated Recap */}
      <div className="mb-8">
        <div className="border-l-4 border-blue-500 bg-gray-50 p-4 rounded">
          <div className="font-semibold text-blue-700 mb-1">AI Summary</div>
          <div className="italic text-gray-700">
            “This month, we completed 12 tasks, launched 1 funnel, and generated 153 leads. Next up: nurture sequence + retargeting.”
          </div>
        </div>
      </div>

      {/* Feedback/CTA */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline">Leave Feedback</Button>
        <Button asChild>
          <a href="https://calendly.com/agency/strategy-call" target="_blank" rel="noopener noreferrer">
            Schedule Next Strategy Call
          </a>
        </Button>
        {/* Optional thumbs up/down */}
        <div className="flex gap-2 ml-2">
          <button className="p-2 rounded-full hover:bg-gray-100 text-green-500" title="Thumbs up">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 00-6 0v4" /><path strokeLinecap="round" strokeLinejoin="round" d="M5 15h14a2 2 0 002-2v-2a2 2 0 00-2-2H7a2 2 0 00-2 2v2a2 2 0 002 2z" /></svg>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 text-red-500" title="Thumbs down">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 15v4a3 3 0 006 0v-4" /><path strokeLinecap="round" strokeLinejoin="round" d="M19 9H5a2 2 0 00-2 2v2a2 2 0 002 2h12a2 2 0 002-2v-2a2 2 0 00-2-2z" /></svg>
          </button>
        </div>
      </div>

      {/* Last updated */}
      <div className="text-xs text-gray-400 text-right">
        Last updated on {dummySummary.lastUpdated.toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
      </div>
    </div>
  );
} 