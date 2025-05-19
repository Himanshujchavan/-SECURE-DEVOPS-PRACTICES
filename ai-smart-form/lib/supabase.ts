import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
)

// Define database types
export type Submission = {
  id: string
  username: string
  email: string
  message: string
  is_safe: boolean
  confidence: number
  category: string | null
  created_at: string
}

export type SecurityLog = {
  id: string
  input_data: Record<string, any>
  result: Record<string, any>
  ip_address: string | null
  created_at: string
}

// Database functions
export async function saveSubmission(data: {
  username: string
  email: string
  message: string
  is_safe: boolean
  confidence: number
  category?: string
}) {
  const { data: submission, error } = await supabase
    .from("submissions")
    .insert([
      {
        username: data.username,
        email: data.email,
        message: data.message,
        is_safe: data.is_safe,
        confidence: data.confidence,
        category: data.category || null,
      },
    ])
    .select()

  if (error) {
    console.error("Error saving submission:", error)
    throw error
  }

  return submission[0]
}

export async function saveSecurityLog(data: {
  input_data: Record<string, any>
  result: Record<string, any>
  ip_address?: string
}) {
  const { data: log, error } = await supabase
    .from("security_logs")
    .insert([
      {
        input_data: data.input_data,
        result: data.result,
        ip_address: data.ip_address || null,
      },
    ])
    .select()

  if (error) {
    console.error("Error saving security log:", error)
    throw error
  }

  return log[0]
}

export async function getSubmissions(options?: {
  limit?: number
  offset?: number
  filter?: "all" | "safe" | "malicious" | "flagged"
  search?: string
}) {
  let query = supabase.from("submissions").select("*").order("created_at", { ascending: false })

  // Apply filter
  if (options?.filter) {
    switch (options.filter) {
      case "safe":
        query = query.eq("is_safe", true)
        break
      case "malicious":
        query = query.eq("is_safe", false)
        break
      case "flagged":
        query = query.eq("category", "flagged")
        break
    }
  }

  // Apply search
  if (options?.search) {
    query = query.or(
      `username.ilike.%${options.search}%,email.ilike.%${options.search}%,message.ilike.%${options.search}%`,
    )
  }

  // Apply pagination
  if (options?.limit) {
    query = query.limit(options.limit)
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching submissions:", error)
    throw error
  }

  return { data, count }
}
