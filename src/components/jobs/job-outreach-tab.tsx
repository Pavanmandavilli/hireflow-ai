"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PhoneOutgoing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorAlert } from "@/components/shared/error-alert";
import { CallsTable } from "@/components/calls/calls-table";
import { CallDetailSheet } from "@/components/calls/call-detail-sheet";
import { useCalls } from "@/hooks/use-calls";
import { useCandidates } from "@/hooks/use-candidates";
import type { Job } from "@/types/job";
import type { Call } from "@/types/call";

export function JobOutreachTab({ job }: { job: Job }) {
  const router = useRouter();
  const callsQuery = useCalls(job.id);
  const candidatesQuery = useCandidates(job.id);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);

  const calls = useMemo(() => callsQuery.data?.data ?? [], [callsQuery.data]);
  const candidates = useMemo(() => candidatesQuery.data?.data ?? [], [candidatesQuery.data]);
  const candidatesById = useMemo(() => new Map(candidates.map((c) => [c.id, c] as const)), [candidates]);
  const jobsById = useMemo(() => new Map([[job.id, job] as const]), [job]);

  if (callsQuery.isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-md" />
        ))}
      </div>
    );
  }

  if (callsQuery.error) {
    return <ErrorAlert message={callsQuery.error instanceof Error ? callsQuery.error.message : "Failed to load calls."} />;
  }

  if (calls.length === 0) {
    return (
      <EmptyState
        icon={PhoneOutgoing}
        title="No AI calls yet"
        description="Start an AI outreach campaign to see calls here."
        action={
          <Button size="sm" onClick={() => router.push(`/outreach?jobId=${job.id}`)}>
            <PhoneOutgoing />
            Start Outreach
          </Button>
        }
      />
    );
  }

  return (
    <>
      <CallsTable
        calls={calls}
        candidatesById={candidatesById}
        jobsById={jobsById}
        onSelect={setSelectedCall}
        showJobColumn={false}
      />
      <CallDetailSheet
        call={selectedCall}
        candidate={selectedCall ? candidatesById.get(selectedCall.candidate_id) : undefined}
        open={!!selectedCall}
        onOpenChange={(open) => !open && setSelectedCall(null)}
      />
    </>
  );
}
