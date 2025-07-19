# Supabase Setup Guide

## 🚀 Quick Setup

Your Supabase integration is now configured! Here's what you need to do to get it working:

### 1. Set Up Your Database

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to your project: `mnnicdzpbfqjwtvbykry`
3. Go to **SQL Editor**
4. Copy and paste the contents of `supabase-schema.sql` into the editor
5. Click **Run** to create all the tables and policies

### 2. Configure Authentication

1. In your Supabase dashboard, go to **Authentication > Settings**
2. Under **Site URL**, add: `http://localhost:3001`
3. Under **Redirect URLs**, add: `http://localhost:3001/dashboard`
4. Save the changes

### 3. Test the Integration

1. Start your development server: `npm run dev`
2. Visit `http://localhost:3001/signup` to create a new account
3. After signing up, you'll be redirected to the dashboard
4. Try creating some test data in the CRM, Pipeline, or Planner sections

## 📁 Files Created

- `src/lib/supabase.ts` - Supabase client configuration with your credentials
- `src/lib/auth.tsx` - Authentication context and hooks
- `src/lib/database.ts` - Database utility functions
- `supabase-schema.sql` - Database schema to run in Supabase

## 🔧 Database Tables

The schema creates these tables:

- **users** - User profiles (extends Supabase auth)
- **clients** - Client information and relationships
- **pipeline_items** - Sales pipeline data with stages
- **tasks** - Daily tasks and to-dos
- **goals** - Weekly goals with progress tracking
- **notes** - Meeting notes and ideas

## 🔒 Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Policies** ensure users can only access their own data
- **Automatic user profile creation** when users sign up
- **Type-safe database operations** with TypeScript

## 🎯 Next Steps

### Enable Real Authentication
1. Update the login/signup forms to use the `useAuth` hook
2. Add authentication guards to protected routes
3. Implement password reset functionality

### Add Real Data
1. Replace static data in your pages with database calls
2. Add loading states and error handling
3. Implement real-time updates with Supabase subscriptions

### Advanced Features
1. File uploads for client documents
2. Email notifications for important events
3. Analytics and reporting
4. Team collaboration features

## 🐛 Troubleshooting

### Common Issues

1. **"No user found" errors**: Make sure you've run the SQL schema
2. **Authentication not working**: Check your redirect URLs in Supabase settings
3. **Database permission errors**: Verify RLS policies are in place

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- Check the browser console for error messages

## 🔐 Environment Variables

For production, create a `.env.local` file with:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://mnnicdzpbfqjwtvbykry.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

The credentials are currently hardcoded in `src/lib/supabase.ts` for development convenience. 