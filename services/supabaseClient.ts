// This is a workaround for using the Supabase client from a CDN script in a TypeScript environment.
declare const supabase: any;

const { createClient } = supabase;

// IMPORTANT: Replace with your Supabase project's URL and anon key
const supabaseUrl = 'https://pqyigsddbwxzvononzfu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxeWlnc2RkYnd4enZvbm9uemZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMDk1MTksImV4cCI6MjA3NDc4NTUxOX0.M_aBDVuHyHPqw7g2KrUtxZE1gfKuZP9VH4ei01mo88o';

// FIX: Removed validation checks that caused TypeScript errors by comparing hardcoded
// constants to placeholder strings. Since the credentials have been provided, these
// checks were unnecessary.


export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);