import { createClient } from "@supabase/supabase-js"

// Use demo Supabase instance for testing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://demo-supabase-url.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "demo-anon-key"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For demo purposes, fall back to local storage if Supabase fails
export const createServerClient = () => {
  try {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || supabaseUrl,
      process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey,
    )
  } catch (error) {
    console.warn("Supabase connection failed, using demo mode")
    return null
  }
}
