"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle, AlertTriangle, Search, Filter, Download, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { getSubmissions, type Submission } from "@/lib/supabase"

export function DashboardView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    safe: 0,
    malicious: 0,
    flagged: 0,
  })

  // Fetch submissions when tab or search changes
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const filter = activeTab === "all" ? undefined : (activeTab as "safe" | "malicious" | "flagged")
        const { data } = await getSubmissions({
          filter,
          search: searchTerm,
          limit: 20,
        })
        setSubmissions(data as Submission[])

        // Also fetch stats
        const allData = await getSubmissions({ limit: 1000 })
        const allSubmissions = allData.data as Submission[]

        setStats({
          total: allSubmissions.length,
          safe: allSubmissions.filter((s) => s.is_safe).length,
          malicious: allSubmissions.filter((s) => !s.is_safe).length,
          flagged: allSubmissions.filter((s) => s.category === "flagged").length,
        })
      } catch (error) {
        console.error("Error fetching submissions:", error)
        // If there's an error, use empty array
        setSubmissions([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [activeTab, searchTerm])

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Form Submissions</CardTitle>
        <CardDescription>Monitor and analyze user input submissions</CardDescription>
      </CardHeader>

      <div className="px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-muted rounded-lg p-4"
          >
            <div className="text-sm text-muted-foreground">Total Submissions</div>
            <div className="text-2xl font-bold mt-1">{stats.total}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-green-50 rounded-lg p-4"
          >
            <div className="text-sm text-green-600">Safe Inputs</div>
            <div className="text-2xl font-bold mt-1 text-green-700">{stats.safe}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-red-50 rounded-lg p-4"
          >
            <div className="text-sm text-red-600">Malicious Inputs</div>
            <div className="text-2xl font-bold mt-1 text-red-700">{stats.malicious}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-amber-50 rounded-lg p-4"
          >
            <div className="text-sm text-amber-600">Flagged for Review</div>
            <div className="text-2xl font-bold mt-1 text-amber-700">{stats.flagged}</div>
          </motion.div>
        </div>
      </div>

      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search submissions..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Last 24 hours</DropdownMenuItem>
                <DropdownMenuItem>Last 7 days</DropdownMenuItem>
                <DropdownMenuItem>Last 30 days</DropdownMenuItem>
                <DropdownMenuItem>All time</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="safe">Safe</TabsTrigger>
            <TabsTrigger value="malicious">Malicious</TabsTrigger>
            <TabsTrigger value="flagged">Flagged</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="m-0">
            <SubmissionsTable submissions={submissions} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="safe" className="m-0">
            <SubmissionsTable submissions={submissions} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="malicious" className="m-0">
            <SubmissionsTable submissions={submissions} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="flagged" className="m-0">
            <SubmissionsTable submissions={submissions} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {submissions.length} of {stats.total} submissions
        </div>
      </CardFooter>
    </Card>
  )
}

function SubmissionsTable({ submissions, isLoading }: { submissions: Submission[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-6 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Confidence</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No submissions found
              </TableCell>
            </TableRow>
          ) : (
            submissions.map((submission, index) => (
              <motion.tr
                key={submission.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
                className="border-b relative group"
              >
                <TableCell>
                  {submission.is_safe ? (
                    <motion.div
                      className="flex items-center"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-600">Safe</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="flex items-center"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-red-600">Malicious</span>
                    </motion.div>
                  )}
                </TableCell>
                <TableCell>{submission.username}</TableCell>
                <TableCell>{submission.email}</TableCell>
                <TableCell className="max-w-[200px] truncate">{submission.message}</TableCell>
                <TableCell>
                  <span
                    className={`font-medium ${
                      submission.confidence > 90
                        ? submission.is_safe
                          ? "text-green-600"
                          : "text-red-600"
                        : "text-amber-600"
                    }`}
                  >
                    {submission.confidence}%
                  </span>
                </TableCell>
                <TableCell>{new Date(submission.created_at).toLocaleDateString()}</TableCell>

                {/* Add a hover action menu */}
                <motion.div
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </motion.div>
              </motion.tr>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
