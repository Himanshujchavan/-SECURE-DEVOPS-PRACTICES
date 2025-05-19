"use client"

import { motion } from "framer-motion"
import { Brain, Shield, AlertTriangle, Database, Server } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AIExplainer() {
  const steps = [
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Input is analyzed by a Hugging Face toxicity detection model to identify harmful content.",
    },
    {
      icon: Shield,
      title: "Pattern Matching",
      description: "Known attack patterns like XSS, SQL injection, and command injection are detected.",
    },
    {
      icon: AlertTriangle,
      title: "Risk Assessment",
      description: "A confidence score is calculated based on the AI model's output and pattern matching.",
    },
    {
      icon: Database,
      title: "Secure Storage",
      description: "Safe inputs are stored securely, while malicious inputs are logged for security analysis.",
    },
    {
      icon: Server,
      title: "Real-time Protection",
      description: "The entire process happens in real-time as you type, providing immediate feedback.",
    },
  ]

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          How AI Validation Works
        </CardTitle>
        <CardDescription>
          Our form uses Hugging Face's AI models to detect potentially malicious input in real-time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
