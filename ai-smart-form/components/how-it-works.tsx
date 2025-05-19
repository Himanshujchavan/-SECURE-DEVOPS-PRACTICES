"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "User Input Collection",
      description: "The system collects user input from forms and validates it in real-time.",
    },
    {
      number: "02",
      title: "AI Analysis",
      description: "Our AI model analyzes the input for patterns that match known attack vectors.",
    },
    {
      number: "03",
      title: "Risk Assessment",
      description: "The system calculates a risk score and confidence level for each input.",
    },
    {
      number: "04",
      title: "Feedback & Protection",
      description: "Users receive immediate feedback, and malicious inputs are blocked.",
    },
  ]

  return (
    <section className="py-20">
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered validation system works in four simple steps to keep your applications secure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-6 -left-6 text-7xl font-bold text-primary/10">{step.number}</div>
              <div className="p-6 rounded-xl border bg-card shadow-sm relative z-10">
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button asChild size="lg">
            <Link href="/demo">Try the Demo</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
