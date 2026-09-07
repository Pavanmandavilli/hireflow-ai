"use client";

import { use } from "react";
import Link from "next/link";
import { Search, PhoneOutgoing } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DemoBanner } from "@/components/shared/demo-banner";
import { ErrorAlert } from "@/components/shared/error-alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobStatusBadge } from "@/components/jobs/job-status-badge";
import { JobOverviewTab } from "@/components/jobs/job-overview-tab";
import { JobCandidatesTab } from "@/components/jobs/job-candidates-tab";
import { JobOutreachTab } from "@/components/jobs/job-outreach-tab";
import { useJob } from "@/hooks/use-jobs";

export default function JobDetailPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = use(params);
  const id = Number(jobId);
  const jobQuery = useJob(Number.isFinite(id) ? id : undefined);

  if (jobQuery.isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  if (jobQuery.error || !jobQuery.data) {
    return (
      <ErrorAlert
        title="Job not found"
        message={jobQuery.error instanceof Error ? jobQuery.error.message : "We couldn't find that job."}
      />
    );
  }

  const job = jobQuery.data.data;

  return (
    <div className="flex flex-col gap-6">
      {jobQuery.data.isDemo && <DemoBanner />}
      <PageHeader
        title={
          <span className="flex items-center gap-3">
            {job.title}
            <JobStatusBadge status={job.status} />
          </span>
        }
        subtitle={job.location ?? "Remote"}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href={`/jobs/${job.id}/candidates`}>
                <Search />
                Find Candidates
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/outreach?jobId=${job.id}`}>
                <PhoneOutgoing />
                Start Outreach
              </Link>
            </Button>
          </>
        }
      />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="outreach">Outreach</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <JobOverviewTab job={job} />
        </TabsContent>
        <TabsContent value="candidates" className="mt-4">
          <JobCandidatesTab job={job} />
        </TabsContent>
        <TabsContent value="outreach" className="mt-4">
          <JobOutreachTab job={job} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
