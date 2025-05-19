import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { validateWithAI } from "@/lib/ai-validator"

// Define the request schema
const requestSchema = z.object({
  text: z.string().min(1, "Text is required"),
  field: z.string().optional(),
})

// Rate limiting configuration
const RATE_LIMIT = 10 // requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute in milliseconds

// Simple in-memory store for rate limiting
// In production, use Redis or a similar solution
const ipRequests = new Map<string, { count: number; resetTime: number }>()

/**
 * API route for scanning input with AI
 */
export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown"

    // Check rate limit
    const now = Date.now()
    const ipData = ipRequests.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW }

    // Reset count if the window has passed
    if (now > ipData.resetTime) {
      ipData.count = 0
      ipData.resetTime = now + RATE_LIMIT_WINDOW
    }

    // Increment count and check limit
    ipData.count++
    ipRequests.set(ip, ipData)

    if (ipData.count > RATE_LIMIT) {
      return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 })
    }

    // Parse and validate the request body
    const body = await request.json()
    const validatedData = requestSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validatedData.error.format() },
        { status: 400 },
      )
    }

    // Validate the input text with AI
    const { text, field } = validatedData.data
    const result = await validateWithAI(text)

    // Return the validation result
    return NextResponse.json({
      ...result,
      field: field || null,
    })
  } catch (error) {
    console.error("Error in scan-input API:", error)
    return NextResponse.json({ error: "An error occurred while processing your request" }, { status: 500 })
  }
}
