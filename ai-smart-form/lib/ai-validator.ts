import { z } from "zod"
import { HfInference } from "@huggingface/inference"

// Define the schema for validation requests
const validationRequestSchema = z.object({
  text: z.string().min(1, "Text is required for validation"),
  context: z.string().optional(),
})

// Define the schema for validation responses
const validationResponseSchema = z.object({
  isSafe: z.boolean(),
  confidence: z.number().min(0).max(100),
  category: z.enum(["safe", "xss", "sql-injection", "command-injection", "path-traversal", "other"]),
  explanation: z.string(),
})

// Initialize the Hugging Face inference client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

// Pattern matching for specific attack types
const patterns = {
  xss: /<script>|javascript:|on\w+\s*=|alert\s*\(|document\.cookie/i,
  sqlInjection:
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER)\b.*\b(FROM|INTO|TABLE)\b)|('|").*(\s|\+)(\b(OR|AND)\b).*('|")|--.*$/i,
  commandInjection: /;|\||\$\(|`|&/,
  pathTraversal: /\.\.\//,
}

/**
 * Validates text input using an AI model to detect malicious content
 */
export async function validateWithAI(input: string): Promise<{
  isSafe: boolean
  confidence: number
  category: string
  explanation: string
}> {
  try {
    // First, check for known attack patterns
    if (patterns.xss.test(input)) {
      return {
        isSafe: false,
        confidence: 95,
        category: "xss",
        explanation: "Contains patterns commonly used in Cross-Site Scripting (XSS) attacks.",
      }
    } else if (patterns.sqlInjection.test(input)) {
      return {
        isSafe: false,
        confidence: 90,
        category: "sql-injection",
        explanation: "Contains SQL syntax that could be used for SQL Injection attacks.",
      }
    } else if (patterns.commandInjection.test(input)) {
      return {
        isSafe: false,
        confidence: 85,
        category: "command-injection",
        explanation: "Contains characters commonly used for Command Injection attacks.",
      }
    } else if (patterns.pathTraversal.test(input)) {
      return {
        isSafe: false,
        confidence: 80,
        category: "path-traversal",
        explanation: "Contains directory traversal patterns that could be used to access unauthorized files.",
      }
    }

    // For inputs that don't match known patterns, use the AI model
    // Use Hugging Face's toxicity detection model
    const result = await hf.textClassification({
      model: "unitary/toxic-bert",
      inputs: input,
    })

    // Extract the toxicity scores
    const toxicScore = result.find((r) => r.label === "toxic")?.score || 0
    const threatScore = result.find((r) => r.label === "threat")?.score || 0
    const insultScore = result.find((r) => r.label === "insult")?.score || 0

    // Calculate overall risk score (0-100)
    const riskScore = Math.round((toxicScore + threatScore + insultScore) * 100)

    // Determine if the input is safe based on the risk score
    const isSafe = riskScore < 30

    return {
      isSafe,
      confidence: isSafe ? 100 - riskScore : riskScore,
      category: isSafe ? "safe" : "other",
      explanation: isSafe
        ? "AI analysis indicates this input is likely safe."
        : `AI detected potentially harmful content with ${riskScore}% confidence.`,
    }
  } catch (error) {
    console.error("Error in AI validation:", error)

    // Fallback to basic pattern matching if AI fails
    const hasSuspiciousChars = /[<>{}[\]]/g.test(input)
    const hasLongStrings = input.length > 100 && /[a-f0-9]{32,}/i.test(input)

    if (hasSuspiciousChars || hasLongStrings) {
      return {
        isSafe: false,
        confidence: 60,
        category: "other",
        explanation: "Input contains suspicious patterns. AI validation failed, using fallback detection.",
      }
    }

    return {
      isSafe: true,
      confidence: 70,
      category: "safe",
      explanation: "Input appears safe. Note: AI validation failed, using fallback detection.",
    }
  }
}

/**
 * Analyzes multiple fields in a form submission
 */
export async function analyzeFormSubmission(data: Record<string, string>) {
  // Process each field
  const results = await Promise.all(
    Object.entries(data).map(async ([field, value]) => {
      if (!value || value.trim() === "") {
        return {
          field,
          result: {
            isSafe: true,
            confidence: 100,
            category: "safe",
            explanation: "Empty input is considered safe.",
          },
        }
      }

      const result = await validateWithAI(value)
      return { field, result }
    }),
  )

  // Find the first unsafe field, or the field with the lowest confidence
  const unsafeField = results.find((r) => !r.result.isSafe)
  if (unsafeField) {
    return {
      isSafe: false,
      confidence: unsafeField.result.confidence,
      field: unsafeField.field,
      message: `${unsafeField.result.explanation} Found in ${unsafeField.field}.`,
      category: unsafeField.result.category,
    }
  }

  // If all fields are safe, return the one with the lowest confidence
  results.sort((a, b) => a.result.confidence - b.result.confidence)
  const lowestConfidence = results[0]

  return {
    isSafe: true,
    confidence: lowestConfidence.result.confidence,
    field: lowestConfidence.field,
    message: lowestConfidence.result.explanation,
    category: "safe",
  }
}
