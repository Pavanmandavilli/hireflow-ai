import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Trend } from "@/lib/dashboard-metrics";

function TrendIndicator({ trend }: { trend: Trend }) {
  if (trend.percent === null) {
    return trend.current > 0 ? (
      <span className="text-xs font-medium text-muted-foreground">+{trend.current} this week</span>
    ) : (
      <span className="text-xs text-muted-foreground">No change this week</span>
    );
  }
  const isUp = trend.percent >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium",
        isUp ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
      )}
    >
      {isUp ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
      {Math.abs(trend.percent)}% vs last week
    </span>
  );
}

export function KpiCard({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  trend?: Trend;
}) {
  return (
    <Card className="gap-3 py-5">
      <CardContent className="flex flex-col gap-3 px-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{label}</span>
          <div className="flex size-8 items-center justify-center rounded-md bg-accent">
            <Icon className="size-4 text-accent-foreground" />
          </div>
        </div>
        <span className="text-3xl font-semibold tabular-nums text-foreground">{value}</span>
        {trend && <TrendIndicator trend={trend} />}
      </CardContent>
    </Card>
  );
}
