import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  format?: "number" | "percentage" | "ms";
  testId?: string;
}

export function KPICard({ title, value, change, icon: Icon, format = "number", testId }: KPICardProps) {
  const formatValue = (val: string | number) => {
    if (format === "percentage") {
      return `${(Number(val) * 100).toFixed(1)}%`;
    }
    if (format === "ms") {
      return `${Number(val).toFixed(0)}ms`;
    }
    return val;
  };

  const changeColor = change && change > 0 ? "text-chart-2" : change && change < 0 ? "text-destructive" : "text-muted-foreground";
  const ChangeIcon = change && change > 0 ? ArrowUp : ArrowDown;

  return (
    <Card data-testid={testId}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold tracking-tight" data-testid={`${testId}-value`}>
          {formatValue(value)}
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs mt-2 ${changeColor}`}>
            <ChangeIcon className="h-3 w-3" />
            <span>{Math.abs(change).toFixed(1)}% from last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
