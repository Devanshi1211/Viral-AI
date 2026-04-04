# Database Setup for GU Hackathon Project

This folder contains SQL files to set up the Supabase database for the ViralAI social media content optimization platform.

## Database Connection

The project is configured to connect to Supabase with the following credentials:
- **Project URL**: https://jthnophgvmduyywbzgmb.supabase.co
- **Database Name**: gu Hackathon
- **Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0aG5vcGhndm1kdXl5d2J6Z21iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMTI3MTgsImV4cCI6MjA5MDc4ODcxOH0.loDJi3H8uYU53LjRZ-oCERRB4-FVK6-A3i74SCu6n6g

## Setup Instructions

1. **Access Supabase Dashboard**:
   - Go to https://supabase.com/dashboard
   - Sign in to your account
   - Select the "gu Hackathon" project

2. **Run SQL Scripts**:
   - Open the SQL Editor in your Supabase dashboard
   - First, run `drop_tables.sql` to remove any existing tables (optional, only if you want to start fresh)
   - Then, run `tables.sql` to create all the necessary tables, policies, and indexes

3. **Verify Setup**:
   - Check the "Table Editor" to ensure all tables were created
   - Verify Row Level Security (RLS) policies are in place
   - Test authentication by signing up/logging in through the app

## Database Schema

### Core Tables

- **`content_optimizations`**: Stores AI-generated content optimizations for different platforms
- **`platform_analyses`**: Stores analytics data for social media accounts
- **`trend_analyses`**: Stores trend analysis results
- **`virality_predictions`**: Stores virality prediction results
- **`content_plans`**: Stores user-created content planning data
- **`user_profiles`**: Extended user profile information
- **`posts`**: Stores social media posts and their metadata

### Security

All tables have Row Level Security (RLS) enabled with policies that ensure users can only access their own data. The `auth.users` table is managed by Supabase Auth.

### Indexes

Performance indexes are created on frequently queried columns like `user_id`, `platform`, and date fields.

## Environment Variables

The following environment variables are configured in `lib/env.ts`:

```typescript
SUPABASE_URL: "https://jthnophgvmduyywbzgmb.supabase.co"
SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Next Steps

After setting up the database:

1. Start the development server: `npm run dev`
2. Visit `/signup` to create an account
3. Visit `/login` to sign in
4. The main dashboard will be protected and require authentication

## Troubleshooting

- If you encounter authentication issues, check that the anon key is correct
- Ensure all tables and policies were created successfully
- Check the browser console and server logs for any errors
- Verify that the Supabase project is active and accessible