import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { analyzeFormSubmission } from "@/lib/ai-validator"

// Define the form submission schema
const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(5, "Message must be at least 5 characters"),
})

/**
 * API route for form submissions
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json()
    const validatedData = formSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json({ error: "Invalid form data", details: validatedData.error.format() }, { status: 400 })
    }

    // Analyze the form submission for security threats
    const securityAnalysis = await analyzeFormSubmission(validatedData.data)

    // If the submission is not safe, reject it
    if (!securityAnalysis.isSafe) {
      return NextResponse.json(
        {
          error: "Security validation failed",
          details: securityAnalysis,
        },
        { status: 403 },
      )
    }

    // In a real app, you would save the submission to a database here
    // const result = await db.submissions.create({ data: validatedData.data })

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Form submitted successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in submit API:", error)
    return NextResponse.json({ error: "An error occurred while processing your submission" }, { status: 500 })
  }
}
