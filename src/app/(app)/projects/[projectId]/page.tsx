'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import Link from "next/link";
import { createBrowserClient } from '@supabase/ssr';
import { 
  Calendar, 
  MessageSquare, 
  CheckSquare, 
  Clock, 
  Bot, 
  Home,
  AlertCircle,
  Loader2,
  ArrowLeft
} from 'lucide-react';

interface Project {
  id: string;
  project_name: string;
  status: string;
  description?: string;
  start_date: string;
  client_id: string;
  user_id: string;
  agency_id: string;
  created_at: string;
  updated_at: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  status: string;
}

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

  const supabase = createBrowserClient(
    'https://mnnicdzpbfqjwtvbykry.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubmljZHpwYmZxand0dmJ5a3J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNjkyODAsImV4cCI6MjA2Nzc0NTI4MH0.G46t1BlaBAxIZ9hhpkEbUEOBqDQGASn-Poh4OS11h8o'
  );

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch project details
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (projectError) {
          console.error('Error fetching project:', projectError);
          setError('Project not found or access denied');
          return;
        }

        if (!projectData) {
          setError('Project not found');
          return;
        }

        setProject(projectData);

        // Fetch client details
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('id', projectData.client_id)
          .single();

        if (clientError) {
          console.error('Error fetching client:', clientError);
          setError('Client information not found');
          return;
        }

        setClient(clientData);

      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProjectData();
    }
  }, [projectId, supabase]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const navItems = [
    { href: `/projects/${projectId}/overview`, label: 'Overview', icon: Home },
    { href: `/projects/${projectId}/tasks`, label: 'Tasks', icon: CheckSquare },
    { href: `/projects/${projectId}/messages`, label: 'Messages', icon: MessageSquare },
    { href: `/projects/${projectId}/timeline`, label: 'Timeline', icon: Clock },
    { href: `/projects/${projectId}/uploads`, label: 'Uploads', icon: Calendar },
    { href: `/projects/${projectId}/results`, label: 'Results', icon: CheckSquare },
    { href: `/projects/${projectId}/assistant`, label: 'AI Assistant', icon: Bot },
    { href: `/projects/${projectId}/summary`, label: 'Summary', icon: Home },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Project</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/crm')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </button>
        </div>
      </div>
    );
  }

  if (!project || !client) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Project or client data not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/crm')}
                className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Clients
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{project.project_name}</h1>
                <p className="text-sm text-gray-500">Client: {client.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Outlet for subpages */}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <div key={item.href} className={`${isActive ? 'block' : 'hidden'}`}>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">{item.label}</h2>
                  <p className="text-gray-600">This section is under construction.</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 