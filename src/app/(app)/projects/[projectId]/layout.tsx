"use client";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const projectId = params.projectId as string;

  const navLinks = [
    { label: 'Overview', href: `/projects/${projectId}/overview` },
    { label: 'Timeline', href: `/projects/${projectId}/timeline` },
    { label: 'Tasks', href: `/projects/${projectId}/tasks` },
    { label: 'Messages', href: `/projects/${projectId}/messages` },
    { label: 'AI Assistant', href: `/projects/${projectId}/assistant` },
    { label: 'Assets', href: `/projects/${projectId}/assets` },
    { label: 'Results', href: `/projects/${projectId}/results` },
    { label: 'Meetings', href: `/projects/${projectId}/meetings` },
    { label: 'Summary', href: `/projects/${projectId}/summary` },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar would be here if present */}
      <div className="flex-1 flex flex-col">
        {/* Top Project Nav */}
        <nav className="fixed top-0 left-0 w-full flex justify-center z-30 pointer-events-none">
          <div className="flex items-center gap-4 mt-6 pointer-events-auto">
            {/* Back arrow in a circle */}
            <Link
              href="/crm"
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-100 transition-colors border border-gray-200 text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Back to Clients"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            {/* Pill-shaped tab nav */}
            <div className="flex-1 flex justify-center">
              <div className="flex items-center bg-white shadow-lg rounded-full border border-gray-200 px-2 sm:px-3 py-1 gap-1 sm:gap-2 overflow-x-auto">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 whitespace-nowrap ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-purple-500 text-white shadow'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </nav>
        {/* Project Content */}
        <main className="flex-1 pt-28">
          {children}
        </main>
      </div>
    </div>
  );
} 