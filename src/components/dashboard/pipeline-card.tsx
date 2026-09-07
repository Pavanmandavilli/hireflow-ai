import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PipelineStage } from "@/lib/dashboard-metrics";

export function PipelineCard({ stages }: { stages: PipelineStage[] }) {
  const max = Math.max(1, ...stages.map((s) => s.count));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Hiring Pipeline</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {stages.map((stage) => (
          <div key={stage.key} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-sm text-muted-foreground">{stage.label}</span>
            <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.max(4, (stage.count / max) * 100)}%` }}
              />
            </div>
            <span className="w-8 shrink-0 text-right text-sm font-semibold tabular-nums text-foreground">
              {stage.count}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
