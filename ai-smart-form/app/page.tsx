import { HeroSection } from "@/components/hero-section"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <Features />
      <HowItWorks />
    </main>
  )
}
