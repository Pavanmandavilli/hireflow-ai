import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OutreachSummary } from "@/lib/dashboard-metrics";

export function OutreachSummaryCard({ summary }: { summary: OutreachSummary }) {
  const rows: { label: string; value: number }[] = [
    { label: "Calls Today", value: summary.callsToday },
    { label: "Connected", value: summary.connected },
    { label: "Interested", value: summary.interested },
    { label: "Qualified", value: summary.qualified },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>AI Outreach Summary</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {rows.map((row) => (
          <div key={row.label} className="rounded-md border border-border p-4">
            <p className="text-2xl font-semibold tabular-nums text-foreground">{row.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{row.label}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
