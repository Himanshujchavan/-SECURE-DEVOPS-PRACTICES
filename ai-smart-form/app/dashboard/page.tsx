import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { DashboardView } from "@/components/dashboard-view"
import { ZapReportViewer } from "@/components/zap-report-viewer"

export default async function DashboardPage() {
  // Check if user is authenticated
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <main className="min-h-screen py-12">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Security Dashboard</h1>
          <p className="text-lg text-muted-foreground">Monitor form submissions and security metrics in one place.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DashboardView />
          </div>
          <div>
            <ZapReportViewer />
          </div>
        </div>
      </div>
    </main>
  )
}
