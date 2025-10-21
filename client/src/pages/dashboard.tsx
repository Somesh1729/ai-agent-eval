import { useQuery } from "@tanstack/react-query";
import { Activity, CheckCircle2, Clock, Target } from "lucide-react";
import { KPICard } from "@/components/kpi-card";
import { TrendChart } from "@/components/trend-chart";
import { Skeleton } from "@/components/ui/skeleton";
import type { Eval } from "@shared/schema";

interface DashboardStats {
  avgScore: number;
  avgLatency: number;
  redactionRate: number;
  successRate: number;
  scoresTrend: Array<{ date: string; value: number }>;
  latencyTrend: Array<{ date: string; value: number }>;
}

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/stats/dashboard"],
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of your AI agent evaluation metrics
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center space-y-4">
          <Activity className="h-16 w-16 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-semibold">No data yet</h2>
          <p className="text-muted-foreground">
            Start ingesting evaluations to see your dashboard metrics
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of your AI agent evaluation metrics
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Average Score"
          value={stats.avgScore}
          icon={Target}
          format="percentage"
          testId="card-avg-score"
        />
        <KPICard
          title="Average Latency"
          value={stats.avgLatency}
          icon={Clock}
          format="ms"
          testId="card-avg-latency"
        />
        <KPICard
          title="Redaction Rate"
          value={stats.redactionRate}
          icon={CheckCircle2}
          format="percentage"
          testId="card-redaction-rate"
        />
        <KPICard
          title="Success Rate"
          value={stats.successRate}
          icon={Activity}
          format="percentage"
          testId="card-success-rate"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TrendChart
          title="Score Trend (30 Days)"
          data={stats.scoresTrend}
          color="hsl(var(--chart-1))"
          format="percentage"
          testId="chart-score-trend"
        />
        <TrendChart
          title="Latency Trend (30 Days)"
          data={stats.latencyTrend}
          color="hsl(var(--chart-3))"
          format="ms"
          testId="chart-latency-trend"
        />
      </div>
    </div>
  );
}
