import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = 'https://mnnicdzpbfqjwtvbykry.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubmljZHpwYmZxand0dmJ5a3J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNjkyODAsImV4cCI6MjA2Nzc0NTI4MH0.G46t1BlaBAxIZ9hhpkEbUEOBqDQGASn-Poh4OS11h8o'

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          company: string
          phone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          company?: string
          phone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          company?: string
          phone?: string
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          company: string
          status: 'lead' | 'prospect' | 'active' | 'inactive'
          value: number
          last_contact: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          company: string
          status?: 'lead' | 'prospect' | 'active' | 'inactive'
          value?: number
          last_contact?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          company?: string
          status?: 'lead' | 'prospect' | 'active' | 'inactive'
          value?: number
          last_contact?: string
          created_at?: string
          updated_at?: string
        }
      }
      pipeline_items: {
        Row: {
          id: string
          user_id: string
          client_id: string
          stage: 'leads' | 'calls_booked' | 'clients'
          value: number
          scheduled_date?: string
          notes?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id: string
          stage: 'leads' | 'calls_booked' | 'clients'
          value?: number
          scheduled_date?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string
          stage?: 'leads' | 'calls_booked' | 'clients'
          value?: number
          scheduled_date?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          project_id: string | null
          title: string
          description?: string
          completed: boolean
          priority: 'low' | 'medium' | 'high'
          due_date?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id?: string | null
          title: string
          description?: string
          completed?: boolean
          priority?: 'low' | 'medium' | 'high'
          due_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string | null
          title?: string
          description?: string
          completed?: boolean
          priority?: 'low' | 'medium' | 'high'
          due_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          title: string
          description?: string
          completed: number
          total: number
          priority: 'low' | 'medium' | 'high'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string
          completed?: number
          total: number
          priority?: 'low' | 'medium' | 'high'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          completed?: number
          total?: number
          priority?: 'low' | 'medium' | 'high'
          created_at?: string
          updated_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          user_id: string
          project_id: string | null
          title: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id?: string | null
          title: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string | null
          title?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 