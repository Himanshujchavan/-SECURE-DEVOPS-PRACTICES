"use client"

import { motion } from "framer-motion"
import { Shield, AlertTriangle, AlertCircle, Info, Download, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Mock ZAP report data
const zapReport = {
  scanDate: "2023-05-18T20:30:00Z",
  score: 85,
  vulnerabilities: {
    high: 0,
    medium: 2,
    low: 5,
    info: 8,
  },
  summary:
    "The application is generally secure, but there are some medium and low risk issues that should be addressed.",
}

export function ZapReportViewer() {
  return (
    <Card className="shadow-md h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          ZAP Security Report
        </CardTitle>
        <CardDescription>OWASP ZAP vulnerability scan results</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="mb-6">
          <div className="text-sm text-muted-foreground mb-2">
            Last scan: {new Date(zapReport.scanDate).toLocaleString()}
          </div>

          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium">Security Score</div>
            <div className="text-sm font-medium">{zapReport.score}%</div>
          </div>

          <Progress
            value={zapReport.score}
            className="h-2"
            indicatorClassName={
              zapReport.score >= 90 ? "bg-green-500" : zapReport.score >= 70 ? "bg-amber-500" : "bg-red-500"
            }
          />

          <div className="text-xs text-muted-foreground mt-1">
            {zapReport.score >= 90
              ? "Excellent"
              : zapReport.score >= 70
                ? "Good"
                : zapReport.score >= 50
                  ? "Fair"
                  : "Poor"}
          </div>
        </div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between p-3 rounded-lg bg-red-50"
          >
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-sm font-medium text-red-700">High Risk</span>
            </div>
            <motion.span
              className="text-sm font-bold text-red-700"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {zapReport.vulnerabilities.high}
            </motion.span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between p-3 rounded-lg bg-amber-50"
          >
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
              <span className="text-sm font-medium text-amber-700">Medium Risk</span>
            </div>
            <motion.span
              className="text-sm font-bold text-amber-700"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {zapReport.vulnerabilities.medium}
            </motion.span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between p-3 rounded-lg bg-blue-50"
          >
            <div className="flex items-center">
              <Info className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-blue-700">Low Risk</span>
            </div>
            <motion.span
              className="text-sm font-bold text-blue-700"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {zapReport.vulnerabilities.low}
            </motion.span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
          >
            <div className="flex items-center">
              <Info className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Informational</span>
            </div>
            <motion.span
              className="text-sm font-bold text-gray-700"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {zapReport.vulnerabilities.info}
            </motion.span>
          </motion.div>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-muted text-sm">
          <p className="font-medium mb-1">Summary</p>
          <p className="text-muted-foreground">{zapReport.summary}</p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <Button className="w-full group relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100"
            initial={false}
            whileHover={{ opacity: 1 }}
          />
          <motion.div
            className="flex items-center"
            whileHover={{ x: 2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Full Report
          </motion.div>
        </Button>
        <Button variant="outline" className="w-full group relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100"
            initial={false}
            whileHover={{ opacity: 1 }}
          />
          <motion.div
            className="flex items-center"
            whileHover={{ rotate: 15 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
          </motion.div>
          Run New Scan
        </Button>
      </CardFooter>
    </Card>
  )
}
