import { useQuery } from "@tanstack/react-query";
import { TrendChart } from "@/components/trend-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3 } from "lucide-react";

interface AnalyticsData {
  scoresTrend7d: Array<{ date: string; value: number }>;
  scoresTrend30d: Array<{ date: string; value: number }>;
  latencyTrend7d: Array<{ date: string; value: number }>;
  latencyTrend30d: Array<{ date: string; value: number }>;
  flagsDistribution: Array<{ name: string; count: number }>;
}

export default function Analytics() {
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics"],
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Deep dive into evaluation trends and patterns
          </p>
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center space-y-4">
          <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-semibold">No analytics data</h2>
          <p className="text-muted-foreground">
            Evaluation data will appear here once you start ingesting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Deep dive into evaluation trends and patterns
        </p>
      </div>

      <Tabs defaultValue="7d" className="space-y-6">
        <TabsList>
          <TabsTrigger value="7d" data-testid="tab-7d">7 Days</TabsTrigger>
          <TabsTrigger value="30d" data-testid="tab-30d">30 Days</TabsTrigger>
        </TabsList>

        <TabsContent value="7d" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <TrendChart
              title="Score Trend (7 Days)"
              data={analytics.scoresTrend7d}
              color="hsl(var(--chart-1))"
              format="percentage"
              testId="chart-score-7d"
            />
            <TrendChart
              title="Latency Trend (7 Days)"
              data={analytics.latencyTrend7d}
              color="hsl(var(--chart-3))"
              format="ms"
              testId="chart-latency-7d"
            />
          </div>
        </TabsContent>

        <TabsContent value="30d" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <TrendChart
              title="Score Trend (30 Days)"
              data={analytics.scoresTrend30d}
              color="hsl(var(--chart-1))"
              format="percentage"
              testId="chart-score-30d"
            />
            <TrendChart
              title="Latency Trend (30 Days)"
              data={analytics.latencyTrend30d}
              color="hsl(var(--chart-3))"
              format="ms"
              testId="chart-latency-30d"
            />
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Flags Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.flagsDistribution.map((flag) => (
              <div key={flag.name} className="flex items-center justify-between">
                <span className="text-sm font-medium">{flag.name}</span>
                <div className="flex items-center gap-4">
                  <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${(flag.count / Math.max(...analytics.flagsDistribution.map((f) => f.count))) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {flag.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
