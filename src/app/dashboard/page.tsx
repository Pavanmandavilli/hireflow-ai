"use client";

import { useMemo } from "react";
import { Briefcase, Users, PhoneCall, UserCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DemoBanner } from "@/components/shared/demo-banner";
import { ErrorAlert } from "@/components/shared/error-alert";
import { Skeleton } from "@/components/ui/skeleton";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PipelineCard } from "@/components/dashboard/pipeline-card";
import { OutreachSummaryCard } from "@/components/dashboard/outreach-summary-card";
import { RecentActivityCard } from "@/components/dashboard/recent-activity-card";
import { useJobs } from "@/hooks/use-jobs";
import { useCandidates } from "@/hooks/use-candidates";
import { useCalls } from "@/hooks/use-calls";
import { useShortlist } from "@/hooks/use-shortlist";
import { computeKpis, computeOutreachSummary, computePipeline, computeRecentActivity } from "@/lib/dashboard-metrics";

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const jobsQuery = useJobs();
  const candidatesQuery = useCandidates();
  const callsQuery = useCalls();
  const { decisions } = useShortlist();

  const isLoading = jobsQuery.isLoading || candidatesQuery.isLoading || callsQuery.isLoading;
  const error = jobsQuery.error ?? candidatesQuery.error ?? callsQuery.error;
  const isDemo = jobsQuery.data?.isDemo || candidatesQuery.data?.isDemo || callsQuery.data?.isDemo;

  const jobs = useMemo(() => jobsQuery.data?.data ?? [], [jobsQuery.data]);
  const candidates = useMemo(() => candidatesQuery.data?.data ?? [], [candidatesQuery.data]);
  const calls = useMemo(() => callsQuery.data?.data ?? [], [callsQuery.data]);

  const kpis = useMemo(() => computeKpis(jobs, candidates, calls), [jobs, candidates, calls]);
  const pipeline = useMemo(() => computePipeline(candidates, calls, decisions), [candidates, calls, decisions]);
  const outreach = useMemo(() => computeOutreachSummary(calls), [calls]);
  const activity = useMemo(() => computeRecentActivity(jobs, candidates, calls), [jobs, candidates, calls]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={greeting()} subtitle="Here's an overview of your hiring activity." />

      {isDemo && <DemoBanner />}
      {error && <ErrorAlert message={error instanceof Error ? error.message : "Failed to load dashboard data."} />}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard icon={Briefcase} label="Open Jobs" value={kpis.openJobs} trend={kpis.openJobsTrend} />
          <KpiCard icon={Users} label="Candidates" value={kpis.totalCandidates} />
          <KpiCard icon={PhoneCall} label="AI Calls" value={kpis.totalCalls} trend={kpis.callsTrend} />
          <KpiCard
            icon={UserCheck}
            label="Qualified Candidates"
            value={kpis.qualifiedCandidates}
            trend={kpis.qualifiedTrend}
          />
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-72 rounded-lg" />
          <Skeleton className="h-72 rounded-lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <PipelineCard stages={pipeline} />
          <OutreachSummaryCard summary={outreach} />
        </div>
      )}

      {isLoading ? <Skeleton className="h-64 rounded-lg" /> : <RecentActivityCard items={activity} />}
    </div>
  );
}
