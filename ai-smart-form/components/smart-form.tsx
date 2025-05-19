"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Shield, AlertTriangle, CheckCircle, Loader2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { scanInput } from "@/lib/actions"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(5, {
    message: "Message must be at least 5 characters.",
  }),
})

type FormValues = z.infer<typeof formSchema>

export function SmartForm() {
  const [aiResult, setAiResult] = useState<{
    isSafe: boolean
    confidence: number
    field: string | null
    message: string
    category?: string
  } | null>(null)

  const [isScanning, setIsScanning] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [scanHistory, setScanHistory] = useState<Array<{ field: string; timestamp: number }>>([])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      message: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsScanning(true)
    setAiResult(null)

    try {
      // Scan all fields
      const result = await scanInput({
        username: values.username,
        email: values.email,
        message: values.message,
      })

      setAiResult(result)

      if (result.isSafe) {
        // If safe, show success message
        setSubmitted(true)
        setTimeout(() => {
          setSubmitted(false)
          form.reset()
          setAiResult(null)
          setScanHistory([])
        }, 3000)
      } else {
        // If not safe, shake the field
        if (result.field) {
          shakeField(result.field)
        }
      }
    } catch (error) {
      console.error("Error scanning input:", error)
    } finally {
      setIsScanning(false)
    }
  }

  // Debounced field validation with cooldown
  const validateField = async (field: string, value: string) => {
    if (!value || value.length < 3) return

    // Check if we've scanned this field recently (within 1 second)
    const now = Date.now()
    const recentScan = scanHistory.find((scan) => scan.field === field && now - scan.timestamp < 1000)

    if (recentScan) return

    // Add to scan history
    setScanHistory([...scanHistory, { field, timestamp: now }])

    setIsScanning(true)

    try {
      const result = await scanInput({ [field]: value })
      setAiResult(result)
    } catch (error) {
      console.error("Error scanning input:", error)
    } finally {
      setIsScanning(false)
    }
  }

  const shakeField = (fieldName: string) => {
    const element = document.querySelector(`[name="${fieldName}"]`)
    if (element) {
      element.classList.add("shake-animation")
      setTimeout(() => {
        element.classList.remove("shake-animation")
      }, 500)
    }
  }

  // Get icon based on category
  const getCategoryIcon = () => {
    if (!aiResult) return null

    if (aiResult.isSafe) {
      return <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
    }

    switch (aiResult.category) {
      case "xss":
        return <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
      case "sql-injection":
        return <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
      case "command-injection":
        return <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
      case "path-traversal":
        return <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
      default:
        return <Info className="w-5 h-5 text-amber-500 mt-0.5" />
    }
  }

  return (
    <div className="p-6 rounded-xl border bg-card shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your username"
                    {...field}
                    className={
                      aiResult?.field === "username"
                        ? aiResult.isSafe
                          ? "border-green-500 focus-visible:ring-green-500"
                          : "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }
                    onChange={(e) => {
                      field.onChange(e)
                      validateField("username", e.target.value)
                    }}
                  />
                </FormControl>
                <FormDescription>Your public display name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    type="email"
                    {...field}
                    className={
                      aiResult?.field === "email"
                        ? aiResult.isSafe
                          ? "border-green-500 focus-visible:ring-green-500"
                          : "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }
                    onChange={(e) => {
                      field.onChange(e)
                      validateField("email", e.target.value)
                    }}
                  />
                </FormControl>
                <FormDescription>We'll never share your email with anyone else.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter your message"
                    {...field}
                    className={
                      aiResult?.field === "message"
                        ? aiResult.isSafe
                          ? "border-green-500 focus-visible:ring-green-500"
                          : "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }
                    onChange={(e) => {
                      field.onChange(e)
                      validateField("message", e.target.value)
                    }}
                  />
                </FormControl>
                <div className="flex justify-between">
                  <FormDescription>Your message to us.</FormDescription>
                  <FormDescription>{field.value.length} characters</FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <AnimatePresence>
            {aiResult && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`p-4 rounded-lg ${
                  aiResult.isSafe ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  {getCategoryIcon()}
                  <div className="flex-1">
                    <p className={`font-medium ${aiResult.isSafe ? "text-green-700" : "text-red-700"}`}>
                      {aiResult.isSafe ? "Input looks safe" : "Potentially malicious input detected"}
                      {aiResult.category && !aiResult.isSafe && ` (${aiResult.category})`}
                    </p>
                    <p className={`text-sm ${aiResult.isSafe ? "text-green-600" : "text-red-600"}`}>
                      {aiResult.message}
                    </p>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{aiResult.isSafe ? "Safety" : "Risk"} confidence</span>
                        <span>{aiResult.confidence}%</span>
                      </div>
                      <Progress
                        value={aiResult.confidence}
                        className={`h-2 ${aiResult.isSafe ? "bg-green-100" : "bg-red-100"}`}
                        indicatorClassName={aiResult.isSafe ? "bg-green-500" : "bg-red-500"}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                className="p-4 rounded-lg bg-green-50 border border-green-200"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                  >
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="font-medium text-green-700"
                  >
                    Form submitted successfully!
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button type="submit" className="w-full relative overflow-hidden group" disabled={isScanning}>
            <motion.div
              className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"
              initial={false}
              whileHover={{
                opacity: 1,
                transition: { duration: 0.2 },
              }}
            />
            {isScanning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanning with AI...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Submit Securely
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
