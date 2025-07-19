import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export async function POST(request: Request) {
  const supabase = await createClient()
  
  const formData = await request.formData()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  if (!email || !password) {
    return redirect('/login?error=Missing email or password')
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  // Successful login - redirect to dashboard
  redirect('/dashboard')
} 