"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { KPICard } from "@/components/kpi-card"
import { EvalDetailSheet } from "@/components/eval-detail-sheet"
import { TrendChart } from "@/components/trend-chart"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { format, subDays } from "date-fns"
import Link from "next/link"

interface Evaluation {
  id: string
  interaction_id: string
  prompt: string
  response: string
  score: number
  latency_ms: number
  flags: string[]
  pii_tokens_redacted: number
  created_at: string
}

interface TrendData {
  date: string
  score: number
  latency: number
  count: number
}

export default function DashboardPage() {
  const [evals, setEvals] = useState<Evaluation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEval, setSelectedEval] = useState<Evaluation | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [trendData7d, setTrendData7d] = useState<TrendData[]>([])
  const [trendData30d, setTrendData30d] = useState<TrendData[]>([])
  const [dbError, setDbError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          router.push("/auth/login")
          return
        }

        const { data: evalsData, error: evalsError } = await supabase
          .from("evals")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(100)

        if (evalsError) {
          console.error("[v0] Supabase error:", evalsError)
          // Check if it's a table not found error
          if (evalsError.message?.includes("relation") || evalsError.message?.includes("does not exist")) {
            setDbError("Database tables not initialized. Please run the SQL migration scripts.")
          } else {
            setDbError(`Database error: ${evalsError.message}`)
          }
          setEvals([])
          setIsLoading(false)
          return
        }

        setEvals(evalsData || [])
        setDbError(null)

        // Generate trend data for 7 days
        const trend7d: Record<string, TrendData> = {}
        for (let i = 6; i >= 0; i--) {
          const date = format(subDays(new Date(), i), "MMM dd")
          trend7d[date] = { date, score: 0, latency: 0, count: 0 }
        }

        // Generate trend data for 30 days
        const trend30d: Record<string, TrendData> = {}
        for (let i = 29; i >= 0; i--) {
          const date = format(subDays(new Date(), i), "MMM dd")
          trend30d[date] = { date, score: 0, latency: 0, count: 0 }
        }

        // Aggregate data
        evalsData?.forEach((eval_) => {
          const evalDate = new Date(eval_.created_at)
          const daysAgo = Math.floor((new Date().getTime() - evalDate.getTime()) / (1000 * 60 * 60 * 24))

          if (daysAgo < 7) {
            const date = format(evalDate, "MMM dd")
            if (trend7d[date]) {
              trend7d[date].score += eval_.score
              trend7d[date].latency += eval_.latency_ms
              trend7d[date].count += 1
            }
          }

          if (daysAgo < 30) {
            const date = format(evalDate, "MMM dd")
            if (trend30d[date]) {
              trend30d[date].score += eval_.score
              trend30d[date].latency += eval_.latency_ms
              trend30d[date].count += 1
            }
          }
        })

        // Calculate averages
        Object.values(trend7d).forEach((day) => {
          if (day.count > 0) {
            day.score = day.score / day.count
            day.latency = Math.round(day.latency / day.count)
          }
        })

        Object.values(trend30d).forEach((day) => {
          if (day.count > 0) {
            day.score = day.score / day.count
            day.latency = Math.round(day.latency / day.count)
          }
        })

        setTrendData7d(Object.values(trend7d))
        setTrendData30d(Object.values(trend30d))
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load dashboard data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  // Calculate KPIs
  const avgScore =
    evals.length > 0 ? ((evals.reduce((sum, e) => sum + e.score, 0) / evals.length) * 100).toFixed(1) : "0"
  const avgLatency = evals.length > 0 ? Math.round(evals.reduce((sum, e) => sum + e.latency_ms, 0) / evals.length) : 0
  const totalRedacted = evals.reduce((sum, e) => sum + e.pii_tokens_redacted, 0)
  const redactionRate = evals.length > 0 ? ((totalRedacted / evals.length) * 100).toFixed(1) : "0"
  const successRate =
    evals.length > 0 ? ((evals.filter((e) => e.score >= 0.8).length / evals.length) * 100).toFixed(1) : "0"

  const filteredEvals = evals.filter(
    (eval_) =>
      eval_.interaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eval_.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eval_.flags.some((f) => f.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading dashboard...</p>
      </div>
    )
  }

  if (dbError) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">AI Agent Evaluation Dashboard</h1>
              <p className="text-sm text-muted-foreground">Monitor and analyze your AI agent evaluations</p>
            </div>
            <div className="flex gap-2">
              <Link href="/settings">
                <Button variant="outline">Settings</Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-900">Database Not Initialized</CardTitle>
              <CardDescription className="text-red-800">{dbError}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-red-800">
                To set up your database, please run the following SQL scripts in your Supabase dashboard:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-red-800">
                <li>Go to your Supabase project dashboard</li>
                <li>Click "SQL Editor" in the left sidebar</li>
                <li>
                  Create a new query and run:{" "}
                  <code className="bg-red-100 px-2 py-1 rounded">scripts/001_create_tables.sql</code>
                </li>
                <li>
                  Create another query and run:{" "}
                  <code className="bg-red-100 px-2 py-1 rounded">scripts/002_rls_policies.sql</code>
                </li>
                <li>Refresh this page</li>
              </ol>
              <Button onClick={() => window.location.reload()}>Refresh Page</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">AI Agent Evaluation Dashboard</h1>
            <p className="text-sm text-muted-foreground">Monitor and analyze your AI agent evaluations</p>
          </div>
          <div className="flex gap-2">
            <Link href="/settings">
              <Button variant="outline">Settings</Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard title="Average Score" value={avgScore} unit="%" description="Overall evaluation score" />
          <KPICard title="Avg Latency" value={avgLatency} unit="ms" description="Average response time" />
          <KPICard title="Redaction Rate" value={redactionRate} unit="%" description="PII tokens redacted per eval" />
          <KPICard title="Success Rate" value={successRate} unit="%" description="Evals with score ≥ 0.8" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TrendChart title="7-Day Score Trend" data={trendData7d} dataKey="score" />
          <TrendChart title="7-Day Latency Trend" data={trendData7d} dataKey="latency" unit="ms" />
          <TrendChart title="30-Day Score Trend" data={trendData30d} dataKey="score" />
          <TrendChart title="30-Day Latency Trend" data={trendData30d} dataKey="latency" unit="ms" />
        </div>

        {/* Evaluations Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Evaluations</CardTitle>
            <CardDescription>Last 100 evaluations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Search by interaction ID, prompt, or flags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Interaction ID</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Latency</TableHead>
                    <TableHead>Flags</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvals.length > 0 ? (
                    filteredEvals.map((eval_) => (
                      <TableRow key={eval_.id} className="hover:bg-muted/50 cursor-pointer">
                        <TableCell className="font-mono text-sm">{eval_.interaction_id.slice(0, 12)}...</TableCell>
                        <TableCell>
                          <span className={eval_.score >= 0.8 ? "text-green-600 font-semibold" : "text-orange-600"}>
                            {(eval_.score * 100).toFixed(0)}%
                          </span>
                        </TableCell>
                        <TableCell>{eval_.latency_ms}ms</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {eval_.flags.slice(0, 2).map((flag,index) => (
                              <Badge key={`${flag} - ${index}`} variant="secondary" className="text-xs">
                                {flag}
                              </Badge>
                            ))}
                            {eval_.flags.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{eval_.flags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(eval_.created_at), "MMM dd, HH:mm")}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedEval(eval_)
                              setDetailOpen(true)
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No evaluations found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Sheet */}
      <EvalDetailSheet open={detailOpen} onOpenChange={setDetailOpen} evaluation={selectedEval} />
    </div>
  )
}
