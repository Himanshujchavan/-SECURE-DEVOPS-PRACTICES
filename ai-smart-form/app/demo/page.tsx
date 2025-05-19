import { SmartForm } from "@/components/smart-form"
import { AIExplainer } from "@/components/ai-explainer"

export default function DemoPage() {
  return (
    <main className="min-h-screen py-12">
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Smart Form Demo</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Try entering different inputs to see how our AI detects potentially malicious content. Try some XSS or SQL
            injection patterns to test the system.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <SmartForm />
          </div>
          <div>
            <AIExplainer />
          </div>
        </div>
      </div>
    </main>
  )
}
