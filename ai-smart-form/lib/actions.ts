"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { analyzeFormSubmission } from "./ai-validator"
import { saveSubmission, saveSecurityLog } from "./supabase"

// Enhanced server action with improved validation and logging
export async function scanInput(input: Record<string, string>) {
  console.log("Scanning input:", input)

  // Get client IP for logging
  const headersList = headers()
  const ip = headersList.get("x-forwarded-for") || "unknown"

  try {
    // Use the AI validator to analyze the input
    const result = await analyzeFormSubmission(input)

    // Log the security check
    try {
      await saveSecurityLog({
        input_data: input,
        result,
        ip_address: ip,
      })
    } catch (logError) {
      // Don't fail the request if logging fails
      console.error("Error saving security log:", logError)
    }

    // Log the result for debugging
    console.log("Scan result:", result)

    return result
  } catch (error) {
    console.error("Error in scanInput:", error)

    // Return a fallback result in case of error
    return {
      isSafe: true,
      confidence: 50,
      field: Object.keys(input)[0] || null,
      message: "Error analyzing input. Treating as potentially safe but with low confidence.",
      category: "error",
    }
  }
}

// Add a new function to log submissions for analytics
export async function logSubmission(data: {
  username: string
  email: string
  message: string
  scanResult: {
    isSafe: boolean
    confidence: number
    field: string | null
    message: string
    category?: string
  }
}) {
  try {
    // Save to database
    await saveSubmission({
      username: data.username,
      email: data.email,
      message: data.message,
      is_safe: data.scanResult.isSafe,
      confidence: data.scanResult.confidence,
      category: data.scanResult.category,
    })

    return { success: true }
  } catch (error) {
    console.error("Error logging submission:", error)
    return { success: false, error: "Failed to log submission" }
  }
}

// Enhance the submitForm function with better validation and logging
export async function submitForm(data: {
  username: string
  email: string
  message: string
}) {
  // Validate the input first
  const scanResult = await scanInput(data)

  if (!scanResult.isSafe) {
    // Log the rejected submission for security analysis
    await logSubmission({
      ...data,
      scanResult,
    })

    throw new Error(`Malicious input detected: ${scanResult.message}`)
  }

  // Log the successful submission
  await logSubmission({
    ...data,
    scanResult,
  })

  // Revalidate the page to show updated data
  revalidatePath("/demo")
  revalidatePath("/dashboard")

  return {
    success: true,
    message: "Form submitted successfully!",
    timestamp: new Date().toISOString(),
  }
}
