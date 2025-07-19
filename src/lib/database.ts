import { supabase } from './supabase'
import type { Database } from './supabase'

type Tables = Database['public']['Tables']

// Client operations
export async function getClients() {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export async function createClient(client: Tables['clients']['Insert']) {
  const { data, error } = await supabase
    .from('clients')
    .insert(client)
    .select()
    .single()
  
  return { data, error }
}

export async function updateClient(id: string, updates: Tables['clients']['Update']) {
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  return { data, error }
}

export async function deleteClient(id: string) {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id)
  
  return { error }
}

// Pipeline operations
export async function getPipelineItems() {
  const { data, error } = await supabase
    .from('pipeline_items')
    .select(`
      *,
      clients (
        id,
        name,
        email,
        company
      )
    `)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export async function createPipelineItem(item: Tables['pipeline_items']['Insert']) {
  const { data, error } = await supabase
    .from('pipeline_items')
    .insert(item)
    .select()
    .single()
  
  return { data, error }
}

export async function updatePipelineItem(id: string, updates: Tables['pipeline_items']['Update']) {
  const { data, error } = await supabase
    .from('pipeline_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  return { data, error }
}

// Task operations
export async function getTasks(projectId?: string) {
  let query = supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });
  if (projectId) query = query.eq('project_id', projectId);
  const { data, error } = await query;
  return { data, error };
}

export async function createTask(task: Tables['tasks']['Insert']) {
  if (!task.project_id) throw new Error('project_id is required');
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .select()
    .single();
  return { data, error };
}

export async function updateTask(id: string, updates: Tables['tasks']['Update']) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  return { data, error }
}

// Goal operations
export async function getGoals() {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export async function createGoal(goal: Tables['goals']['Insert']) {
  const { data, error } = await supabase
    .from('goals')
    .insert(goal)
    .select()
    .single()
  
  return { data, error }
}

export async function updateGoal(id: string, updates: Tables['goals']['Update']) {
  const { data, error } = await supabase
    .from('goals')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  return { data, error }
}

// Note operations
export async function getNotes(projectId?: string) {
  let query = supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false });
  if (projectId) query = query.eq('project_id', projectId);
  const { data, error } = await query;
  return { data, error };
}

export async function createNote(note: Tables['notes']['Insert']) {
  if (!note.project_id) throw new Error('project_id is required');
  const { data, error } = await supabase
    .from('notes')
    .insert(note)
    .select()
    .single();
  return { data, error };
}

export async function updateNote(id: string, updates: Tables['notes']['Update']) {
  const { data, error } = await supabase
    .from('notes')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  return { data, error }
}

export async function deleteNote(id: string) {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)
  
  return { error }
}

// User operations
export async function getUserProfile() {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { data: null, error: 'No user found' }
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()
  
  return { data, error }
}

export async function updateUserProfile(updates: Tables['users']['Update']) {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { data: null, error: 'No user found' }
  
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()
  
  return { data, error }
} 

// Timeline Events operations
export async function getTimelineEvents(projectId: string) {
  const { data, error } = await supabase
    .from('timeline_events')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  
  return { data, error };
}

export async function createTimelineEvent(event: {
  project_id: string;
  title: string;
  description?: string;
  is_checked?: boolean;
}) {
  const { data, error } = await supabase
    .from('timeline_events')
    .insert({
      ...event,
      is_checked: event.is_checked ?? false,
    })
    .select()
    .single();
  
  return { data, error };
}

export async function updateTimelineEvent(id: string, updates: {
  title?: string;
  description?: string;
  is_checked?: boolean;
}) {
  const { data, error } = await supabase
    .from('timeline_events')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  return { data, error };
} 