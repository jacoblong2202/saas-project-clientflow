import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { AuthProvider } from "@/lib/auth";
import AppLayoutClient from "./layout-client";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/login');
  }

  // Get user profile data
  const { data: profile } = await supabase
    .from('users')
    .select('full_name, email')
    .eq('id', user.id)
    .single();

  const userDisplayName = profile?.full_name || user.email?.split('@')[0] || 'User';
  const userEmail = profile?.email || user.email || '';

  return (
    <AuthProvider initialUser={user}>
      <AppLayoutClient 
        user={user}
        userDisplayName={userDisplayName}
        userEmail={userEmail}
      >
        {children}
      </AppLayoutClient>
    </AuthProvider>
  );
} 