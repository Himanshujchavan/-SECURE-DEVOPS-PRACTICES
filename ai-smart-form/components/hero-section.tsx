"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, AlertTriangle, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export function HeroSection() {
  const [text, setText] = useState("")
  const fullText = "Smart & Secure Input Validation using AI 🚀"

  useEffect(() => {
    let i = 0
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.substring(0, i + 1))
        i++
      } else {
        clearInterval(typingInterval)
      }
    }, 100)

    return () => clearInterval(typingInterval)
  }, [])

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-background to-background/80">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="container px-4 mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center px-3 py-1 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary">
            <Shield className="w-4 h-4 mr-2" /> DevSecOps + AI
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 min-h-[80px]">{text}</h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Detect malicious user input in real-time with AI & DevSecOps. Protect your applications from XSS, SQL
            injection, and other attacks.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gap-2 relative overflow-hidden group">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <Link href="/demo">
                  Try the Live Demo
                  <motion.div
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="inline-block"
                  >
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </motion.div>
                </Link>
              </motion.div>
            </Button>
            <Button variant="outline" size="lg">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                Learn More
              </motion.div>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 p-6 rounded-xl border bg-card shadow-lg max-w-3xl mx-auto"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <div className="text-sm text-muted-foreground ml-2">Input Validation Demo</div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-10 rounded-md bg-muted animate-pulse" />
              <CheckCircle className="text-green-500" />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-10 rounded-md bg-muted animate-pulse" />
              <AlertTriangle className="text-amber-500" />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-20 rounded-md bg-muted animate-pulse" />
              <Shield className="text-primary" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
