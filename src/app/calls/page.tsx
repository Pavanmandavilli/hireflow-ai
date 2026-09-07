"use client";

import { useMemo, useState } from "react";
import { PhoneCall } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DemoBanner } from "@/components/shared/demo-banner";
import { ErrorAlert } from "@/components/shared/error-alert";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { CallsTable } from "@/components/calls/calls-table";
import { CallDetailSheet } from "@/components/calls/call-detail-sheet";
import { useCalls } from "@/hooks/use-calls";
import { useCandidates } from "@/hooks/use-candidates";
import { useJobs } from "@/hooks/use-jobs";
import { computeOutreachSummary } from "@/lib/dashboard-metrics";
import type { Call } from "@/types/call";

export default function CallsPage() {
  const callsQuery = useCalls();
  const candidatesQuery = useCandidates();
  const jobsQuery = useJobs();
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);

  const calls = useMemo(() => callsQuery.data?.data ?? [], [callsQuery.data]);
  const candidates = useMemo(() => candidatesQuery.data?.data ?? [], [candidatesQuery.data]);
  const jobs = useMemo(() => jobsQuery.data?.data ?? [], [jobsQuery.data]);

  const candidatesById = useMemo(() => new Map(candidates.map((c) => [c.id, c] as const)), [candidates]);
  const jobsById = useMemo(() => new Map(jobs.map((j) => [j.id, j] as const)), [jobs]);
  const summary = useMemo(() => computeOutreachSummary(calls), [calls]);
  const completed = calls.filter((c) => c.status === "COMPLETED").length;

  const isLoading = callsQuery.isLoading;
  const isDemo = callsQuery.data?.isDemo || candidatesQuery.data?.isDemo || jobsQuery.data?.isDemo;

  const kpis = [
    { label: "Calls Today", value: summary.callsToday },
    { label: "Connected", value: summary.connected },
    { label: "Completed", value: completed },
    { label: "Interested", value: summary.interested },
    { label: "Qualified", value: summary.qualified },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="AI Call Center" subtitle="Monitor AI voice screening calls in real time." />

      {isDemo && <DemoBanner />}
      {callsQuery.error && (
        <ErrorAlert message={callsQuery.error instanceof Error ? callsQuery.error.message : "Failed to load calls."} />
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {kpis.map((kpi) => (
            <Card key={kpi.label} className="gap-2 py-4">
              <CardContent className="px-4">
                <p className="text-2xl font-semibold tabular-nums text-foreground">{kpi.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{kpi.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-md" />
          ))}
        </div>
      ) : calls.length === 0 ? (
        <EmptyState
          icon={PhoneCall}
          title="No AI calls yet"
          description="Start an AI outreach campaign to see calls here."
        />
      ) : (
        <CallsTable calls={calls} candidatesById={candidatesById} jobsById={jobsById} onSelect={setSelectedCall} />
      )}

      <CallDetailSheet
        call={selectedCall}
        candidate={selectedCall ? candidatesById.get(selectedCall.candidate_id) : undefined}
        open={!!selectedCall}
        onOpenChange={(open) => !open && setSelectedCall(null)}
      />
    </div>
  );
}
