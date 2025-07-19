"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { Plus, MoreVertical, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function CrmPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", role: "", phone: "", location: "" });
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingClient, setDeletingClient] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [startingProject, setStartingProject] = useState<string | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);


  // Fetch clients and project existence
  useEffect(() => {
    const fetchClients = async () => {
      console.log("Auth state:", { authLoading, user: user?.id });
      
      // If auth is still loading, wait
      if (authLoading) {
        console.log("Auth still loading, waiting...");
        return;
      }
      
      // If no user from context, try to get it directly
      let currentUser = user;
      if (!currentUser) {
        console.log("No user from context, trying direct access...");
        const { data: { user: directUser } } = await supabase.auth.getUser();
        currentUser = directUser;
        console.log("Direct user access result:", { user: !!directUser, userId: directUser?.id });
      }
      
      if (!currentUser) {
        console.log("No user available, cannot fetch clients");
        return;
      }
      
      setLoading(true);
      let query = supabase.from("clients").select("*").eq("user_id", currentUser.id);
      if (sort === "oldest") query = query.order("created_at", { ascending: true });
      else query = query.order("created_at", { ascending: false });
      const { data, error } = await query;
      if (data) {
        // For each client, fetch all projects
        const clientsWithProjects = await Promise.all(
          data.map(async (client: any) => {
            const { data: projects } = await supabase
              .from("projects")
              .select("id, project_name, start_date, status")
              .eq("client_id", client.id)
              .order("created_at", { ascending: false });
            return {
              ...client,
              projects: projects || [],
            };
          })
        );
        setClients(clientsWithProjects);
      } else {
        setClients([]);
      }
      setLoading(false);
    };
    fetchClients();
  }, [user, authLoading, sort, showModal]);

  // Add client
  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAdding(true);

    try {
      // Check if user is authenticated
      if (authLoading) {
        setError("Please wait while we verify your authentication...");
        setAdding(false);
        return;
      }
      
      let currentUser = user;
      
      // Fallback: if context user is null, try to get from session directly
      if (!currentUser) {
        console.log("Context user is null, trying session fallback...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log("Session fallback result:", { session: !!session, user: !!session?.user, error: sessionError });
        
        if (sessionError) {
          console.error("Session fallback error:", sessionError);
          setError("Authentication failed. Please log in again.");
          setAdding(false);
          return;
        }
        
        if (!session || !session.user) {
          console.log("No valid session, trying getUser directly...");
          // Try getting user directly as another fallback
          const { data: { user: directUser }, error: userError } = await supabase.auth.getUser();
          console.log("Direct user result:", { user: !!directUser, error: userError });
          
          if (userError || !directUser) {
            console.error("All authentication methods failed");
            setError("Authentication failed. Please log in again.");
            setAdding(false);
            return;
          }
          
          console.log("Direct user fallback successful:", directUser.id);
          currentUser = directUser;
        } else {
          console.log("Session fallback successful:", session.user.id);
          currentUser = session.user;
        }
      }

      // Validate and trim form data
      const trimmedForm = {
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim(),
        role: form.role.trim(),
        phone: form.phone.trim(),
        location: form.location.trim(),
      };

      // Validate required fields with helpful error messages
      if (!trimmedForm.name) {
        setError("Name is required. Please enter a client name.");
        setAdding(false);
        return;
      }

      if (trimmedForm.name.length < 2) {
        setError("Name must be at least 2 characters long.");
        setAdding(false);
        return;
      }

      // Email is required according to schema
      if (!trimmedForm.email) {
        setError("Email is required. Please enter a client email address.");
        setAdding(false);
        return;
      }

      // Email format validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedForm.email)) {
        setError("Please enter a valid email address.");
        setAdding(false);
        return;
      }

      // Company is required according to schema
      if (!trimmedForm.company) {
        setError("Company is required. Please enter a company name.");
        setAdding(false);
        return;
      }

      // Validate status value against allowed values
      const allowedStatuses = ['lead', 'prospect', 'active', 'inactive'];
      let statusValue = 'lead'; // Default value
      
      if (trimmedForm.role && allowedStatuses.includes(trimmedForm.role.toLowerCase())) {
        statusValue = trimmedForm.role.toLowerCase();
      }

      // Prepare client data with proper field mapping according to schema
      const insertPayload = {
        user_id: currentUser.id,
        name: trimmedForm.name,
        email: trimmedForm.email || '', // Required field, use empty string if not provided
        company: trimmedForm.company || '', // Required field, use empty string if not provided
        status: statusValue, // Validated status value
        value: 0, // Default value
      };

      // Log session and payload for debugging
      console.log("Current User:", currentUser);
      console.log("Insert Payload:", insertPayload);

      // Insert into database
      const { data, error: insertError } = await supabase
        .from("clients")
        .insert(insertPayload)
        .select()
        .single();

      if (insertError) {
        console.error("Database insert error:", JSON.stringify(insertError, null, 2));
        console.error("Full error object:", insertError);
        setError(`Failed to add client: ${insertError.message || 'Unknown error'}`);
        setAdding(false);
        return;
      }

      console.log("Client added successfully:", data);

      // Success - clear form, close modal, and refresh list
      setForm({ name: "", email: "", company: "", role: "", phone: "", location: "" });
      setShowModal(false);
      setError("");
      
      // Refresh the clients list by triggering the useEffect
      // The useEffect depends on showModal, so closing it will trigger a refresh
      
    } catch (error) {
      console.error("Unexpected error:", error);
      console.error("Error stack trace:", error instanceof Error ? error.stack : 'No stack trace available');
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  // Start project
  const handleStartProject = async (client: any) => {
    try {
      setStartingProject(client.id);

      // Check if project already exists for this client
      const { data: existingProject, error: projectError } = await supabase
        .from("projects")
        .select("id, project_name")
        .eq("client_id", client.id)
        .maybeSingle();

      if (projectError) {
        console.error("Error checking existing project:", JSON.stringify(projectError, null, 2));
        if (projectError.code === '42P01') { // Table doesn't exist error
          console.error("Projects table doesn't exist. Please run the SQL in projects-table.sql in your Supabase dashboard.");
          setError("Projects table not set up. Please contact your administrator.");
        } else {
          setError(`Database error: ${projectError.message || 'Unknown error'}`);
        }
        setStartingProject(null);
        return;
      }

      if (existingProject) {
        // Project exists, navigate to it
        router.push(`/projects/${existingProject.id}`);
        setStartingProject(null);
        return;
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error("No authenticated user found");
        setStartingProject(null);
        return;
      }

      // Create new project
      const projectName = `${client.name} Project`;
      const { data: newProject, error: insertError } = await supabase
        .from("projects")
        .insert({
          client_id: client.id,
          user_id: user.id,
          project_name: projectName,
          status: 'active',
          agency_id: user.id // Assuming agency_id is the same as user_id for now
        })
        .select()
        .single();

      if (insertError) {
        console.error("Failed to create project:", JSON.stringify(insertError, null, 2));
        if (insertError.code === '42P01') { // Table doesn't exist error
          setError("Projects table doesn't exist. Please run the SQL in projects-table.sql in your Supabase dashboard.");
        } else {
          setError(`Failed to create project: ${insertError.message || 'Unknown error'}`);
        }
        setStartingProject(null);
        return;
      }

      console.log("Project created successfully:", newProject);

      // Update the client in local state to show "Open Project"
      setClients(prevClients => 
        prevClients.map(c => 
          c.id === client.id ? { ...c, project_exists: true, project_id: newProject.id } : c
        )
      );

      // Navigate to the new project
      router.push(`/projects/${newProject.id}`);

    } catch (error) {
      console.error("Unexpected error in handleStartProject:", error);
      setStartingProject(null);
    }
  };

  // Edit client
  const handleEditClient = (client: any) => {
    setEditingClient(client);
    setForm({
      name: client.name || "",
      email: client.email || "",
      company: client.company || "",
      role: client.status || "",
      phone: client.phone || "",
      location: client.location || ""
    });
    setShowEditModal(true);
  };

  // Update client
  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setEditing(true);

    try {
      if (!editingClient) return;

      // Validate and trim form data
      const trimmedForm = {
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim(),
        role: form.role.trim(),
        phone: form.phone.trim(),
        location: form.location.trim(),
      };

      // Validate required fields
      if (!trimmedForm.name) {
        setError("Name is required. Please enter a client name.");
        setEditing(false);
        return;
      }

      if (trimmedForm.name.length < 2) {
        setError("Name must be at least 2 characters long.");
        setEditing(false);
        return;
      }

      if (!trimmedForm.email) {
        setError("Email is required. Please enter a client email address.");
        setEditing(false);
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedForm.email)) {
        setError("Please enter a valid email address.");
        setEditing(false);
        return;
      }

      if (!trimmedForm.company) {
        setError("Company is required. Please enter a company name.");
        setEditing(false);
        return;
      }

      // Validate status value against allowed values
      const allowedStatuses = ['lead', 'prospect', 'active', 'inactive'];
      let statusValue = 'lead';
      
      if (trimmedForm.role && allowedStatuses.includes(trimmedForm.role.toLowerCase())) {
        statusValue = trimmedForm.role.toLowerCase();
      }

      // Update client data
      const updatePayload = {
        name: trimmedForm.name,
        email: trimmedForm.email,
        company: trimmedForm.company,
        status: statusValue,
      };

      console.log("Update Payload:", updatePayload);

      const { data, error: updateError } = await supabase
        .from("clients")
        .update(updatePayload)
        .eq("id", editingClient.id)
        .select()
        .single();

      if (updateError) {
        console.error("Database update error:", JSON.stringify(updateError, null, 2));
        setError(`Failed to update client: ${updateError.message || 'Unknown error'}`);
        setEditing(false);
        return;
      }

      console.log("Client updated successfully:", data);

      // Update the client in the local state
      setClients(prevClients => 
        prevClients.map(client => 
          client.id === editingClient.id ? { ...client, ...data } : client
        )
      );

      // Close modal and reset
      setShowEditModal(false);
      setEditingClient(null);
      setForm({ name: "", email: "", company: "", role: "", phone: "", location: "" });
      setError("");

    } catch (error) {
      console.error("Unexpected error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setEditing(false);
    }
  };

  // Delete client
  const handleDeleteClient = (client: any) => {
    setDeletingClient(client);
    setShowDeleteConfirm(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!deletingClient) return;
    
    setDeleting(true);
    try {
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", deletingClient.id);

      if (error) {
        console.error("Delete error:", error);
        setError("Failed to delete client. Please try again.");
        setDeleting(false);
        return;
      }

      // Remove from local state
      setClients(prevClients => 
        prevClients.filter(client => client.id !== deletingClient.id)
      );

      // Close modal and reset
      setShowDeleteConfirm(false);
      setDeletingClient(null);
      setError("");

    } catch (error) {
      console.error("Unexpected error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  // 2. Add New Project handler
  const handleNewProject = async (client: any) => {
    try {
      setStartingProject(client.id);
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) return;
      const projectName = `${client.name} Project ${Math.floor(Math.random() * 10000)}`;
      const { data: newProject, error: insertError } = await supabase
        .from("projects")
        .insert({
          client_id: client.id,
          user_id: currentUser.id,
          project_name: projectName,
          status: 'active',
          agency_id: currentUser.id
        })
        .select()
        .single();
      if (insertError) {
        setError(insertError.message);
        setStartingProject(null);
        return;
      }
      // Refresh client list
      setShowModal(false);
      setStartingProject(null);
      // Redirect directly to project dashboard
      router.push(`/projects/${newProject.id}/overview`);
    } catch (err) {
      setError("Failed to create project");
      setStartingProject(null);
    }
  };

  // 3. Delete Project handler
  const handleDeleteProject = async (projectId: string, clientId: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    await supabase.from("projects").delete().eq("id", projectId);
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, projects: c.projects.filter((p: any) => p.id !== projectId) } : c));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setOpenDropdown(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Filtered clients
  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.company || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
            <p className="text-gray-600 mt-1">Manage your clients and projects</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-black text-white px-6 py-3 rounded-lg shadow-sm hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Client</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search clients by name or company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Client Card Grid */}
      {authLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading authentication...</p>
        </div>
      ) : loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading clients...</p>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
          <p className="text-gray-600">Get started by adding your first client.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map(client => (
            <div
              key={client.id}
              className="rounded-xl bg-white shadow-md p-6 hover:shadow-lg transition-shadow duration-200 relative"
            >
              {/* Dropdown Menu */}
              <div className="absolute top-4 right-4">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(openDropdown === client.id ? null : client.id);
                    }}
                    className="p-1 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                    type="button"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                  
                  {/* Dropdown Content */}
                  {openDropdown === client.id && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClient(client);
                          setOpenDropdown(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Client
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClient(client);
                          setOpenDropdown(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Client
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Client Header */}
              <div className="flex items-center space-x-4 mb-4 pr-8">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-white shadow-sm">
                  <span className="text-white font-semibold text-lg">
                    {client.name?.[0]?.toUpperCase() || "?"}
                  </span>
                </div>
                
                {/* Client Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{client.name}</h3>
                  <p className="text-sm text-gray-600 truncate">{client.company}</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  client.status === 'active' ? 'bg-green-100 text-green-800' :
                  client.status === 'prospect' ? 'bg-yellow-100 text-yellow-800' :
                  client.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {client.status || 'lead'}
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate">{client.email}</span>
                </div>
                {client.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="truncate">{client.phone}</span>
                  </div>
                )}
              </div>

              {/* Projects List */}
              {client.projects && client.projects.length > 0 ? (
                <>
                  <div className="mb-4">
                    <div className="font-semibold text-gray-700 mb-2">Projects</div>
                    <div className="space-y-2">
                      {client.projects.map((project: any) => (
                        <div key={project.id} className="flex items-center justify-between bg-gray-50 rounded shadow-sm px-3 py-2">
                          <div>
                            <div className="font-medium text-sm text-gray-900">{project.project_name}</div>
                            <div className="text-xs text-gray-500">Start: {project.start_date ? new Date(project.start_date).toLocaleDateString() : "-"}</div>
                            <div className="text-xs text-gray-400">Status: {project.status}</div>
                          </div>
                          <div className="flex gap-2 items-center">
                            <button
                              className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium hover:bg-green-200 transition"
                              onClick={() => router.push(`/projects/${project.id}/overview`)}
                            >
                              Open Project
                            </button>
                            <button
                              className="p-1 rounded hover:bg-red-100 text-red-500"
                              onClick={() => handleDeleteProject(project.id, client.id)}
                              title="Delete Project"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    className="w-full py-2.5 px-4 rounded-full border-2 bg-white text-pink-500 font-semibold text-base shadow-sm transition border-pink-400 hover:bg-pink-50 hover:border-pink-500 mb-2"
                    style={{ borderImage: 'linear-gradient(90deg, #f472b6, #ec4899) 1', borderRadius: '9999px' }}
                    onClick={() => handleNewProject(client)}
                    disabled={startingProject === client.id}
                  >
                    {startingProject === client.id ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-400 mr-2"></div>
                        Creating...
                      </div>
                    ) : (
                      '+ New Project'
                    )}
                  </button>
                </>
              ) : (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs text-gray-400">No projects yet — click '+ New Project' to begin</span>
                  </div>
                  <button
                    className="w-full py-2.5 px-4 rounded-full border-2 bg-white text-pink-500 font-semibold text-base shadow-sm transition border-pink-400 hover:bg-pink-50 hover:border-pink-500 mb-2"
                    style={{ borderImage: 'linear-gradient(90deg, #f472b6, #ec4899) 1', borderRadius: '9999px' }}
                    onClick={() => handleNewProject(client)}
                    disabled={startingProject === client.id}
                  >
                    {startingProject === client.id ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-400 mr-2"></div>
                        Creating...
                      </div>
                    ) : (
                      'Start Project'
                    )}
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      {/* Add Client Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add Client</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setError("");
                  setForm({ name: "", email: "", company: "", role: "", phone: "", location: "" });
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <form onSubmit={handleAddClient} className="space-y-3">
              <input 
                required 
                placeholder="Name *" 
                value={form.name} 
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                className="w-full rounded border px-3 py-2 mt-2 text-sm" 
              />
              <input 
                required
                type="email"
                placeholder="Email *" 
                value={form.email} 
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
                className="w-full rounded border px-3 py-2 mt-2 text-sm" 
              />
              <input 
                required
                placeholder="Company *" 
                value={form.company} 
                onChange={e => setForm(f => ({ ...f, company: e.target.value }))} 
                className="w-full rounded border px-3 py-2 mt-2 text-sm" 
              />
              <select 
                value={form.role} 
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))} 
                className="w-full rounded border px-3 py-2 mt-2 text-sm" 
              >
                <option value="">Select Status</option>
                <option value="lead">Lead</option>
                <option value="prospect">Prospect</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <input 
                placeholder="Phone" 
                value={form.phone} 
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} 
                className="w-full rounded border px-3 py-2 mt-2 text-sm" 
              />
              <input 
                placeholder="Location" 
                value={form.location} 
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))} 
                className="w-full rounded border px-3 py-2 mt-2 text-sm" 
              />
              <button 
                type="submit" 
                className="w-full bg-primary text-white rounded py-2 mt-4 hover:bg-primary/80 transition" 
                disabled={adding}
              >
                {adding ? "Adding..." : "Add Client"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Client</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingClient(null);
                  setError("");
                  setForm({ name: "", email: "", company: "", role: "", phone: "", location: "" });
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <form onSubmit={handleUpdateClient} className="space-y-3">
              <input 
                required 
                placeholder="Name *" 
                value={form.name} 
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                className="w-full rounded border px-3 py-2 mt-2 text-sm" 
              />
              <input 
                required
                type="email"
                placeholder="Email *" 
                value={form.email} 
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
                className="w-full rounded border px-3 py-2 mt-2 text-sm" 
              />
              <input 
                required
                placeholder="Company *" 
                value={form.company} 
                onChange={e => setForm(f => ({ ...f, company: e.target.value }))} 
                className="w-full rounded border px-3 py-2 mt-2 text-sm" 
              />
              <select 
                value={form.role} 
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))} 
                className="w-full rounded border px-3 py-2 mt-2 text-sm" 
              >
                <option value="">Select Status</option>
                <option value="lead">Lead</option>
                <option value="prospect">Prospect</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <input 
                placeholder="Phone" 
                value={form.phone} 
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} 
                className="w-full rounded border px-3 py-2 mt-2 text-sm" 
              />
              <input 
                placeholder="Location" 
                value={form.location} 
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))} 
                className="w-full rounded border px-3 py-2 mt-2 text-sm" 
              />
              <button 
                type="submit" 
                className="w-full bg-black text-white rounded py-2 mt-4 hover:bg-gray-800 transition" 
                disabled={editing}
              >
                {editing ? "Updating..." : "Update Client"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Delete Client</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{deletingClient?.name}</strong>? This action cannot be undone.
              </p>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeletingClient(null);
                    setError("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 