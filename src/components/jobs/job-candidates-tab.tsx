"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorAlert } from "@/components/shared/error-alert";
import { CandidatesTable } from "@/components/candidates/candidates-table";
import { useCandidates } from "@/hooks/use-candidates";
import { useCalls } from "@/hooks/use-calls";
import { useShortlist } from "@/hooks/use-shortlist";
import { deriveScreeningStatus } from "@/lib/derive-status";
import type { Job } from "@/types/job";

export function JobCandidatesTab({ job }: { job: Job }) {
  const router = useRouter();
  const candidatesQuery = useCandidates(job.id);
  const callsQuery = useCalls(job.id);
  const { decisions } = useShortlist();

  const candidates = useMemo(() => candidatesQuery.data?.data ?? [], [candidatesQuery.data]);
  const calls = useMemo(() => callsQuery.data?.data ?? [], [callsQuery.data]);

  const callsByCandidate = useMemo(() => {
    const map = new Map<number, typeof calls>();
    for (const call of calls) {
      const list = map.get(call.candidate_id) ?? [];
      list.push(call);
      map.set(call.candidate_id, list);
    }
    return map;
  }, [calls]);

  if (candidatesQuery.isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-md" />
        ))}
      </div>
    );
  }

  if (candidatesQuery.error) {
    return (
      <ErrorAlert
        message={candidatesQuery.error instanceof Error ? candidatesQuery.error.message : "Failed to load candidates."}
      />
    );
  }

  if (candidates.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No candidates found"
        description="Run a candidate search to discover potential matches."
        action={
          <Button size="sm" onClick={() => router.push(`/jobs/${job.id}/candidates`)}>
            <Search />
            Find Candidates
          </Button>
        }
      />
    );
  }

  return (
    <CandidatesTable
      candidates={candidates}
      statusFor={(c) => deriveScreeningStatus(callsByCandidate.get(c.id) ?? [], decisions[c.id] ?? null)}
      onCall={(c) => router.push(`/outreach?jobId=${job.id}&candidateIds=${c.id}`)}
    />
  );
}
