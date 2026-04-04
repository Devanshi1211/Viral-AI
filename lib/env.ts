// Environment variable validation — server-side only

export const env = {
  // AI Keys
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  NVIDIA_API_KEY: process.env.NVIDIA_API_KEY || "",

  // Meta (Instagram + Facebook)
  META_APP_ID: process.env.META_APP_ID || "",
  META_APP_SECRET: process.env.META_APP_SECRET || "",
  META_REDIRECT_URI:
    process.env.META_REDIRECT_URI ||
    "http://localhost:3000/api/auth/meta/callback",

  // Twitter/X
  X_CLIENT_ID: process.env.X_CLIENT_ID || "",
  X_CLIENT_SECRET: process.env.X_CLIENT_SECRET || "",
  X_REDIRECT_URI:
    process.env.X_REDIRECT_URI ||
    "http://localhost:3000/api/auth/x/callback",

  // Supabase
  SUPABASE_URL: process.env.SUPABASE_URL || "https://jthnophgvmduyywbzgmb.supabase.co",
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0aG5vcGhndm1kdXl5d2J6Z21iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMTI3MTgsImV4cCI6MjA5MDc4ODcxOH0.loDJi3H8uYU53LjRZ-oCERRB4-FVK6-A3i74SCu6n6g",
};
