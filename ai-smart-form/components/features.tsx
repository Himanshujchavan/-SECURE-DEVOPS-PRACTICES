"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Zap, BarChart, AlertCircle, Clock, Database } from "lucide-react"

const features = [
  {
    icon: ShieldCheck,
    title: "AI-Powered Protection",
    description: "Machine learning models detect malicious input patterns in real-time.",
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    description: "Get immediate validation results as users type with confidence scores.",
  },
  {
    icon: BarChart,
    title: "Comprehensive Dashboard",
    description: "Monitor submissions and track security metrics in one place.",
  },
  {
    icon: AlertCircle,
    title: "Attack Detection",
    description: "Identify XSS, SQL injection, and other common attack vectors.",
  },
  {
    icon: Clock,
    title: "Real-time Analysis",
    description: "Process and validate user input with minimal latency.",
  },
  {
    icon: Database,
    title: "Secure Storage",
    description: "All data is properly sanitized before storage and processing.",
  },
]

export function Features() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Powerful Security Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered form validation system provides comprehensive protection against various types of malicious
            input.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="p-6 rounded-xl border bg-card shadow-sm hover:shadow-md transition-all hover-lift"
            >
              <motion.div
                className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <feature.icon className="w-6 h-6 text-primary" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
