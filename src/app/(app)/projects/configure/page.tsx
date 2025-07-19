"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Funnel, Zap, Mail, Settings, Rocket } from "lucide-react";
import type { ReactNode } from "react";
import Confetti from "react-confetti";
import { toast } from "react-hot-toast";

// Types
interface Phase {
  name: string;
  startDate: string;
  dueDate: string;
}

interface Task {
  name: string;
  phase: string;
  assignee: string;
  dueDate: string;
}

interface UploadedAsset {
  file: File;
  name: string;
}

// Add timeFrame to ProjectSetupState
interface ProjectSetupState {
  projectName: string;
  selectedClientId: string;
  selectedTemplate: string;
  phases: Phase[];
  tasks: Task[];
  uploadedAssets: UploadedAsset[];
  internalDescription?: string;
  goals?: string[];
  timeFrame?: string;
}

type SetProjectSetup = React.Dispatch<React.SetStateAction<ProjectSetupState>>;

function useProjectSetup(): [ProjectSetupState, SetProjectSetup] {
  const [state, setState] = useState<ProjectSetupState>({
    projectName: "",
    selectedClientId: "",
    selectedTemplate: "",
    phases: [
      { name: "Phase 1", startDate: "", dueDate: "" },
    ],
    tasks: [],
    uploadedAssets: [],
  });
  return [state, setState];
}

type ProjectTemplates = {
  [key: string]: {
    phases: string[];
    tasks: Record<string, string[]>;
  };
};

const projectTemplates: ProjectTemplates = {
  "Funnel Build": {
    phases: ["Discovery", "Wireframe", "Design", "Build", "Launch"],
    tasks: {
      Discovery: ["Kickoff Call", "Gather Assets"],
      Wireframe: ["Create Low-Fidelity Mockups"],
      Design: ["Design High-Fidelity Screens", "Review with Client"],
      Build: ["Develop Funnel Pages", "Integrate Tracking"],
      Launch: ["QA & Testing", "Go Live", "Post-Launch Review"],
    },
  },
  "Automation Setup": {
    phases: ["Planning", "Integration", "Testing", "Deployment"],
    tasks: {
      Planning: ["Requirements Call", "Map Automation Flow"],
      Integration: ["Connect Tools", "Configure Triggers"],
      Testing: ["Run Test Scenarios", "Client Review"],
      Deployment: ["Go Live", "Monitor & Support"],
    },
  },
  "Email Launch": {
    phases: ["Strategy", "Copywriting", "Design", "Send", "Report"],
    tasks: {
      Strategy: ["Kickoff Call", "Define Segments"],
      Copywriting: ["Draft Email Copy", "Client Approval"],
      Design: ["Design Email Template"],
      Send: ["Schedule Campaign", "Send Test Email"],
      Report: ["Analyze Results", "Send Report to Client"],
    },
  },
  Custom: {
    phases: [],
    tasks: {},
  },
};

// Add template meta info
const projectTemplateMeta: Record<string, { subtitle: string; icon: ReactNode; bullets: string }> = {
  "Funnel Build": {
    subtitle: "Perfect for new lead-gen sites",
    icon: <Funnel className="w-8 h-8 text-primary" />,
    bullets: "• 5 phases • 12 tasks • 1 kickoff call",
  },
  "Automation Setup": {
    subtitle: "Ideal for Zapier-heavy builds",
    icon: <Zap className="w-8 h-8 text-primary" />,
    bullets: "• 4 phases • 10 tasks • 2 integrations",
  },
  "Email Launch": {
    subtitle: "Great for campaign rollouts",
    icon: <Mail className="w-8 h-8 text-primary" />,
    bullets: "• 3 phases • 8 tasks • 1 campaign",
  },
  Custom: {
    subtitle: "Start from scratch, fully custom",
    icon: <Settings className="w-8 h-8 text-primary" />,
    bullets: "• Flexible • No pre-filled steps",
  },
};

const steps = [
  "Basics",
  "Goals",
  "Tasks",
  "Time Frame",
  "Uploads",
  "Review",
];

const stepTitles = [
  "Let’s get started.",
  "What’s the goal?",
  "What needs doing first?",
  "What’s the time frame?",
  "Upload any starter assets.",
  "Ready to launch this project?",
];

const stepSubtexts = [
  "Fill in the basics to kick things off.",
  "Define the main objective for this project.",
  "List out the first tasks to tackle.",
  "Set expectations for delivery.",
  "Brand kits, briefs, and more — all in one place.",
  "Review everything before you impress your client.",
];

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-x-4 mb-8">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center">
          <div className={
            cn(
              "w-8 h-8 flex items-center justify-center rounded-full border-2 font-semibold transition-all",
              i === step
                ? "bg-primary text-white border-primary"
                : i < step
                ? "bg-primary/10 text-primary border-primary/30"
                : "bg-muted text-muted-foreground border-muted"
            )
          }>
            {i + 1}
          </div>
          {i < steps.length - 1 && (
            <div className="w-8 h-1 bg-muted mx-2 rounded-full" />
          )}
        </div>
      ))}
    </div>
  );
}

// Live Project Preview Panel
function ProjectPreview({
  setup,
  clients,
  step,
}: {
  setup: ProjectSetupState;
  clients: { id: string; name: string }[];
  step: number;
}) {
  const client = clients.find((c) => c.id === setup.selectedClientId);
  return (
    <div className="bg-muted p-4 rounded-xl text-sm shadow-md w-full md:w-80 md:sticky md:top-8">
      <div className="font-semibold mb-2 text-primary">Live Project Preview</div>
      <div className="mb-2">
        <span className="font-medium">Project Name:</span>{" "}
        {setup.projectName ? (
          <span>{setup.projectName}</span>
        ) : (
          <span className="text-muted-foreground">(Not set yet)</span>
        )}
      </div>
      <div className="mb-2">
        <span className="font-medium">Client:</span>{" "}
        {client ? (
          <span>{client.name}</span>
        ) : (
          <span className="text-muted-foreground">(Not selected)</span>
        )}
      </div>
      <div className="mb-2">
        <span className="font-medium">Project Type:</span>{" "}
        {setup.selectedTemplate ? (
          <span>{setup.selectedTemplate}</span>
        ) : (
          <span className="text-muted-foreground">(Not selected)</span>
        )}
      </div>
      {step >= 2 && (
        <div className="mb-2">
          <span className="font-medium">Phases:</span>
          <ul className="ml-4 mt-1 list-disc">
            {setup.phases.map((phase, i) => (
              <li key={i}>
                <span className="font-medium text-primary">{phase.name}</span>
                {step >= 3 && (
                  <ul className="ml-4 list-disc text-xs text-muted-foreground">
                    {setup.tasks.filter((t) => t.phase === phase.name).map((task, j) => (
                      <li key={j}>{task.name}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Final step summary card (move to file scope)
function FinalSummaryCard({ setup, clients }: { setup: ProjectSetupState; clients: { id: string; name: string }[] }) {
  const client = clients.find((c) => c.id === setup.selectedClientId);
  return (
    <div className="bg-muted p-6 rounded-xl shadow-lg text-base space-y-3">
      <div>
        <span className="font-semibold">Project Name:</span> {setup.projectName}
      </div>
      <div>
        <span className="font-semibold">Client:</span> {client ? client.name : "(Not selected)"}
      </div>
      <div>
        <span className="font-semibold">Project Type:</span> {setup.selectedTemplate}
      </div>
      <div>
        <span className="font-semibold">Phases:</span>
        <ul className="ml-4 mt-1 list-disc">
          {setup.phases.map((phase, i) => (
            <li key={i}>
              <span className="font-medium text-primary">{phase.name}</span>
              <ul className="ml-4 list-disc text-xs text-muted-foreground">
                {setup.tasks.filter((t) => t.phase === phase.name).map((task, j) => (
                  <li key={j}>{task.name}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function InstantProjectCreate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get("client");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUserAndCreateProject() {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user || !clientId) return;
      setUser(data.user);
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert([
          {
            project_name: "Untitled Project",
            status: "draft",
            client_id: clientId,
            user_id: data.user.id,
            agency_id: data.user.id, // or use agency_id if available separately
          },
        ])
        .select()
        .single();
      if (!projectError && project) {
        router.push(`/projects/${project.id}/overview`);
      }
    }
    fetchUserAndCreateProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId, router]);

  return null;
}

function StepContent({
  step,
  setStep,
  setup,
  setSetup,
  clients,
  clientsLoading,
  showConfetti,
  setShowConfetti,
  success,
  setSuccess,
  loading,
  handleCreateProject,
  error,
}: {
  step: number;
  setStep: (n: number) => void;
  setup: ProjectSetupState;
  setSetup: SetProjectSetup;
  clients: { id: string; name: string }[];
  clientsLoading: boolean;
  showConfetti: boolean;
  setShowConfetti: (b: boolean) => void;
  success: boolean;
  setSuccess: (b: boolean) => void;
  loading: boolean;
  handleCreateProject: () => Promise<void>;
  error?: string | null;
}) {
  switch (step) {
    case 0:
      return (
        <form className="space-y-6">
          <div>
            <label className="block font-medium text-sm mb-2" htmlFor="project-title">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              id="project-title"
              type="text"
              className="input input-bordered w-full rounded-xl text-sm px-4 py-3 bg-white border-gray-400 text-gray-900 shadow-sm placeholder:text-muted"
              placeholder="e.g. Website Funnel Setup"
              value={setup.projectName}
              onChange={e => setSetup(s => ({ ...s, projectName: e.target.value }))}
              required
            />
            <p className="text-muted-foreground text-sm mt-1">
              Give your project a short, clear title like 'Website Funnel Setup'.
            </p>
          </div>
          <div>
            <label className="block font-medium text-sm mb-2" htmlFor="project-description">
              Project Description
            </label>
            <textarea
              id="project-description"
              className="input input-bordered w-full rounded-xl text-sm px-4 py-3 bg-white border-gray-400 text-gray-900 shadow-sm placeholder:text-muted min-h-[80px] resize-vertical"
              placeholder="Describe what you’re building in 1–2 sentences."
              value={setup.internalDescription || ""}
              onChange={e => setSetup(s => ({ ...s, internalDescription: e.target.value }))}
              rows={3}
            />
            <p className="text-muted-foreground text-sm mt-1">
              Describe what you’re building in 1–2 sentences.
            </p>
          </div>
          <div>
            <label className="block font-medium text-sm mb-2" htmlFor="client">
              Client
            </label>
            <select
              id="client"
              className="input input-bordered w-full rounded-xl text-sm px-4 py-3 bg-white border-gray-400 text-gray-900 shadow-sm placeholder:text-muted"
              value={setup.selectedClientId}
              onChange={e => setSetup(s => ({ ...s, selectedClientId: e.target.value }))}
              disabled={clientsLoading || !!setup.selectedClientId}
            >
              <option value="">{clientsLoading ? "Loading clients..." : "Select a client"}</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
        </form>
      );
    case 1:
      return (
        <form className="space-y-6">
          <div>
            <label className="block font-medium text-sm mb-2">
              What’s the client trying to achieve?
            </label>
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <input
                  key={i}
                  type="text"
                  className="input input-bordered w-full rounded-xl text-sm px-4 py-3 bg-white border-gray-400 text-gray-900 shadow-sm placeholder:text-muted"
                  placeholder={
                    i === 0
                      ? "e.g. Grow their email list"
                      : i === 1
                      ? "e.g. Improve onboarding funnel"
                      : "e.g. Automate booking flow"
                  }
                  value={setup.goals?.[i] || ""}
                  onChange={e => {
                    const goals = setup.goals ? [...setup.goals] : ["", "", ""];
                    goals[i] = e.target.value;
                    setSetup(s => ({ ...s, goals }));
                  }}
                />
              ))}
            </div>
            <p className="text-muted-foreground text-sm mt-2">
              You’ll see these on the dashboard later — it keeps you focused on what matters.
            </p>
          </div>
        </form>
      );
    case 2:
      const [taskInput, setTaskInput] = React.useState("");
      const initialTasks = setup.tasks || [];
      return (
        <div className="space-y-6">
          <div>
            <label className="block font-medium text-sm mb-2">
              What needs doing first?
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="input input-bordered w-full rounded-xl text-sm px-4 py-3 bg-white border-gray-400 text-gray-900 shadow-sm placeholder:text-muted"
                placeholder="e.g. Kickoff call"
                value={taskInput}
                onChange={e => setTaskInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && taskInput.trim()) {
                    setSetup(s => ({
                      ...s,
                      tasks: [
                        ...(s.tasks || []),
                        { name: taskInput.trim(), phase: "", assignee: "", dueDate: "" },
                      ],
                    }));
                    setTaskInput("");
                  }
                }}
              />
              <button
                type="button"
                className="px-4 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition"
                onClick={() => {
                  if (taskInput.trim()) {
                    setSetup(s => ({
                      ...s,
                      tasks: [
                        ...(s.tasks || []),
                        { name: taskInput.trim(), phase: "", assignee: "", dueDate: "" },
                      ],
                    }));
                    setTaskInput("");
                  }
                }}
              >
                Add
              </button>
            </div>
            <p className="text-muted-foreground text-sm mb-2">
              Add the first things you’ll be doing — like ‘Kickoff call’, ‘Review assets’, or ‘Build landing page’.
            </p>
            <div className="space-y-2">
              {initialTasks.length === 0 && (
                <div className="text-muted-foreground text-sm italic">No tasks added yet.</div>
              )}
              {initialTasks.map((task, i) => (
                <div key={i} className="flex items-center gap-2 bg-muted/50 rounded px-3 py-2">
                  <span className="flex-1 text-base">{task.name}</span>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700 text-sm font-semibold px-2"
                    onClick={() => {
                      setSetup(s => ({
                        ...s,
                        tasks: s.tasks.filter((_, idx) => idx !== i),
                      }));
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    case 3:
      const timeFrames = [
        "1 week",
        "2 weeks",
        "1 month",
        "6 weeks+",
      ];
      const isCustom = setup.timeFrame && !timeFrames.includes(setup.timeFrame);
      return (
        <div className="space-y-6">
          <div>
            <label className="block font-medium text-sm mb-2">
              What’s the broad time frame for this project?
            </label>
            <div className="flex flex-wrap gap-3 mb-3">
              {timeFrames.map((tf) => (
                <button
                  key={tf}
                  type="button"
                  className={cn(
                    "px-5 py-3 rounded-lg border text-base font-medium transition",
                    setup.timeFrame === tf
                      ? "bg-primary text-white border-primary shadow"
                      : "bg-muted/50 border-muted hover:border-primary/40 hover:bg-primary/10"
                  )}
                  onClick={() => setSetup((s) => ({ ...s, timeFrame: tf }))}
                >
                  {tf}
                </button>
              ))}
              <button
                type="button"
                className={cn(
                  "px-5 py-3 rounded-lg border text-base font-medium transition",
                  isCustom
                    ? "bg-primary text-white border-primary shadow"
                    : "bg-muted/50 border-muted hover:border-primary/40 hover:bg-primary/10"
                )}
                onClick={() => setSetup((s) => ({ ...s, timeFrame: "" }))}
              >
                Custom
              </button>
            </div>
            {isCustom && (
              <input
                type="text"
                className="input input-bordered w-full rounded-xl text-sm px-4 py-3 bg-white border-gray-400 text-gray-900 shadow-sm placeholder:text-muted"
                placeholder="Enter custom time frame (e.g. 10 days, Q2 2024)"
                value={setup.timeFrame || ""}
                onChange={e => setSetup((s) => ({ ...s, timeFrame: e.target.value }))}
              />
            )}
            <p className="text-muted-foreground text-sm mt-2">
              No need for exact dates — just a general sense for planning.
            </p>
          </div>
        </div>
      );
    case 4:
      function handleFiles(files: FileList | null) {
        if (!files) return;
        const newAssets = Array.from(files).map((file) => ({ file, name: file.name }));
        setSetup((s) => ({ ...s, uploadedAssets: [...(s.uploadedAssets || []), ...newAssets] }));
      }
      return (
        <div className="space-y-6">
          <div>
            <label className="block font-medium text-sm mb-2">
              Upload any starter assets
            </label>
            <div
              className="rounded-2xl border-2 border-dashed p-6 border-muted hover:bg-muted transition cursor-pointer text-center"
              onClick={() => document.getElementById('file-upload')?.click()}
              onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={e => {
                e.preventDefault();
                handleFiles(e.dataTransfer.files);
              }}
            >
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={e => handleFiles(e.target.files)}
              />
              <div className="text-muted-foreground mb-2">
                Drag & drop files here, or <span className="underline text-primary">browse</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Logos, intake forms, strategy PDFs, and more
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {(setup.uploadedAssets || []).length === 0 && (
                <div className="text-muted-foreground text-sm italic">No files uploaded yet.</div>
              )}
              {(setup.uploadedAssets || []).map((asset, i) => (
                <div key={i} className="flex items-center gap-2 bg-muted/50 rounded px-3 py-2">
                  <span className="flex-1 text-base truncate">{asset.name}</span>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700 text-sm font-semibold px-2"
                    onClick={() => {
                      setSetup(s => ({
                        ...s,
                        uploadedAssets: s.uploadedAssets.filter((_, idx) => idx !== i),
                      }));
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    case 5:
      const client = clients.find((c) => c.id === setup.selectedClientId);
      return (
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Review & Launch</h2>
            <div className="bg-muted p-6 rounded-xl shadow-lg text-base space-y-3">
              <div>
                <span className="font-semibold">Project Title:</span> {setup.projectName}
              </div>
              <div>
                <span className="font-semibold">Description:</span> {setup.internalDescription || <span className="text-muted-foreground">(none)</span>}
              </div>
              <div>
                <span className="font-semibold">Client:</span> {client ? client.name : <span className="text-muted-foreground">(none)</span>}
              </div>
              <div>
                <span className="font-semibold">Goals:</span>
                <ul className="ml-4 mt-1 list-disc">
                  {(setup.goals || []).filter(Boolean).length === 0 && <li className="text-muted-foreground">(none)</li>}
                  {(setup.goals || []).filter(Boolean).map((goal, i) => (
                    <li key={i}>{goal}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="font-semibold">Starter Tasks:</span>
                <ul className="ml-4 mt-1 list-disc">
                  {(setup.tasks || []).length === 0 && <li className="text-muted-foreground">(none)</li>}
                  {(setup.tasks || []).map((task, i) => (
                    <li key={i}>{task.name}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="font-semibold">Time Frame:</span> {setup.timeFrame || <span className="text-muted-foreground">(none)</span>}
              </div>
              <div>
                <span className="font-semibold">Uploaded Files:</span>
                <ul className="ml-4 mt-1 list-disc">
                  {(setup.uploadedAssets || []).length === 0 && <li className="text-muted-foreground">(none)</li>}
                  {(setup.uploadedAssets || []).map((asset, i) => (
                    <li key={i}>{asset.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <div className="flex justify-center">
            <Button
              size="lg"
              className="mt-6 px-8 py-4 text-lg font-bold flex items-center gap-2 bg-primary hover:bg-primary/90 shadow-xl"
              onClick={handleCreateProject}
              disabled={loading}
            >
              {loading ? "Launching..." : "Launch Project"}
            </Button>
          </div>
        </div>
      );
    default:
      return null;
  }
}

// Inline editable card component for phases and tasks
function EditableCard({
  value,
  onChange,
  children,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(value);
  return (
    <div
      className={cn(
        "border rounded-2xl p-6 bg-white transition hover:shadow-md relative group",
        className
      )}
    >
      {editing ? (
        <input
          className="text-lg font-semibold border-b focus:outline-none w-full mb-2"
          value={temp}
          onChange={(e) => setTemp(e.target.value)}
          onBlur={() => {
            setEditing(false);
            onChange(temp);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setEditing(false);
              onChange(temp);
            }
          }}
          autoFocus
        />
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">{value}</span>
          <button
            type="button"
            className="opacity-60 hover:opacity-100 ml-1"
            onClick={() => setEditing(true)}
            tabIndex={-1}
          >
            <Pencil size={16} />
          </button>
        </div>
      )}
      {children}
    </div>
  );
} 