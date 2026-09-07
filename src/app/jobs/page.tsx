"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Briefcase, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DemoBanner } from "@/components/shared/demo-banner";
import { ErrorAlert } from "@/components/shared/error-alert";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { JobsTable } from "@/components/jobs/jobs-table";
import { useJobs } from "@/hooks/use-jobs";
import { useCandidates } from "@/hooks/use-candidates";
import { useCalls } from "@/hooks/use-calls";
import { useShortlist } from "@/hooks/use-shortlist";
import { computeJobStats } from "@/lib/job-metrics";

export default function JobsPage() {
  const jobsQuery = useJobs();
  const candidatesQuery = useCandidates();
  const callsQuery = useCalls();
  const { decisions } = useShortlist();

  const jobs = useMemo(() => jobsQuery.data?.data ?? [], [jobsQuery.data]);
  const candidates = useMemo(() => candidatesQuery.data?.data ?? [], [candidatesQuery.data]);
  const calls = useMemo(() => callsQuery.data?.data ?? [], [callsQuery.data]);
  const stats = useMemo(() => computeJobStats(candidates, calls, decisions), [candidates, calls, decisions]);

  const isDemo = jobsQuery.data?.isDemo;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Jobs"
        subtitle="Manage open roles and track candidate pipelines."
        actions={
          <Button asChild>
            <Link href="/jobs/new">
              <Plus />
              Create Job
            </Link>
          </Button>
        }
      />

      {isDemo && <DemoBanner />}
      {jobsQuery.error && (
        <ErrorAlert message={jobsQuery.error instanceof Error ? jobsQuery.error.message : "Failed to load jobs."} />
      )}

      {jobsQuery.isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-md" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs yet"
          description="Create your first job to start recruiting."
          action={
            <Button asChild size="sm">
              <Link href="/jobs/new">
                <Plus />
                Create Job
              </Link>
            </Button>
          }
        />
      ) : (
        <JobsTable jobs={jobs} stats={stats} />
      )}
    </div>
  );
}
