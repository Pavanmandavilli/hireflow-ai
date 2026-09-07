"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { OutcomeSlice } from "@/lib/analytics-metrics";

const COLORS = ["var(--chart-2)", "var(--chart-4)", "var(--chart-3)", "var(--destructive)"];

export function CallOutcomesChart({ data }: { data: OutcomeSlice[] }) {
  const hasData = data.some((d) => d.count > 0);

  if (!hasData) {
    return (
      <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
        No completed calls yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <Pie data={data} dataKey="count" nameKey="outcome" innerRadius={50} outerRadius={80} paddingAngle={2} isAnimationActive={false}>
          {data.map((entry, i) => (
            <Cell key={entry.outcome} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            fontSize: 12,
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "var(--popover)",
            color: "var(--popover-foreground)",
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
