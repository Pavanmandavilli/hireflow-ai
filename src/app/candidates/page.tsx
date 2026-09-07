"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DemoBanner } from "@/components/shared/demo-banner";
import { ErrorAlert } from "@/components/shared/error-alert";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { CandidatesTable } from "@/components/candidates/candidates-table";
import { useCandidates } from "@/hooks/use-candidates";
import { useJobs } from "@/hooks/use-jobs";
import { useCalls } from "@/hooks/use-calls";
import { useShortlist } from "@/hooks/use-shortlist";
import { deriveScreeningStatus } from "@/lib/derive-status";

export default function CandidatesDirectoryPage() {
  const router = useRouter();
  const candidatesQuery = useCandidates();
  const jobsQuery = useJobs();
  const callsQuery = useCalls();
  const { decisions } = useShortlist();

  const candidates = useMemo(() => candidatesQuery.data?.data ?? [], [candidatesQuery.data]);
  const jobs = useMemo(() => jobsQuery.data?.data ?? [], [jobsQuery.data]);
  const calls = useMemo(() => callsQuery.data?.data ?? [], [callsQuery.data]);

  const jobsById = useMemo(() => new Map(jobs.map((j) => [j.id, j] as const)), [jobs]);
  const callsByCandidate = useMemo(() => {
    const map = new Map<number, typeof calls>();
    for (const call of calls) {
      const list = map.get(call.candidate_id) ?? [];
      list.push(call);
      map.set(call.candidate_id, list);
    }
    return map;
  }, [calls]);

  const isLoading = candidatesQuery.isLoading || jobsQuery.isLoading;
  const isDemo = candidatesQuery.data?.isDemo || jobsQuery.data?.isDemo;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Candidates" subtitle="Every candidate sourced across all your open roles." />

      {isDemo && <DemoBanner />}
      {candidatesQuery.error && (
        <ErrorAlert
          message={candidatesQuery.error instanceof Error ? candidatesQuery.error.message : "Failed to load candidates."}
        />
      )}

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-md" />
          ))}
        </div>
      ) : candidates.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No candidates found"
          description="Run a candidate search from a job to discover potential matches."
        />
      ) : (
        <CandidatesTable
          candidates={candidates}
          jobsById={jobsById}
          statusFor={(c) => deriveScreeningStatus(callsByCandidate.get(c.id) ?? [], decisions[c.id] ?? null)}
          onCall={(c) => router.push(`/outreach?jobId=${c.job_id}&candidateIds=${c.id}`)}
        />
      )}
    </div>
  );
}
