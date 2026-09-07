"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DemoBanner } from "@/components/shared/demo-banner";
import { ErrorAlert } from "@/components/shared/error-alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CallsOverTimeChart } from "@/components/analytics/calls-over-time-chart";
import { CandidateFunnelChart } from "@/components/analytics/candidate-funnel-chart";
import { CallOutcomesChart } from "@/components/analytics/call-outcomes-chart";
import { MatchDistributionChart } from "@/components/analytics/match-distribution-chart";
import { useCandidates } from "@/hooks/use-candidates";
import { useCalls } from "@/hooks/use-calls";
import {
  computeAnalyticsKpis,
  computeCallOutcomes,
  computeCallsOverTime,
  computeCandidateFunnel,
  computeMatchDistribution,
} from "@/lib/analytics-metrics";

export default function AnalyticsPage() {
  const candidatesQuery = useCandidates();
  const callsQuery = useCalls();

  const candidates = useMemo(() => candidatesQuery.data?.data ?? [], [candidatesQuery.data]);
  const calls = useMemo(() => callsQuery.data?.data ?? [], [callsQuery.data]);

  const kpis = useMemo(() => computeAnalyticsKpis(candidates, calls), [candidates, calls]);
  const callsOverTime = useMemo(() => computeCallsOverTime(calls), [calls]);
  const funnel = useMemo(() => computeCandidateFunnel(candidates, calls), [candidates, calls]);
  const outcomes = useMemo(() => computeCallOutcomes(calls), [calls]);
  const distribution = useMemo(() => computeMatchDistribution(candidates), [candidates]);

  const isLoading = candidatesQuery.isLoading || callsQuery.isLoading;
  const isDemo = candidatesQuery.data?.isDemo || callsQuery.data?.isDemo;
  const error = candidatesQuery.error ?? callsQuery.error;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Analytics" subtitle="Track sourcing, outreach, and screening performance." />

      {isDemo && <DemoBanner />}
      {error && <ErrorAlert message={error instanceof Error ? error.message : "Failed to load analytics."} />}

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card className="gap-2 py-4">
            <CardContent className="px-4">
              <p className="text-2xl font-semibold tabular-nums text-foreground">{kpis.totalCandidates}</p>
              <p className="mt-1 text-xs text-muted-foreground">Total Candidates</p>
            </CardContent>
          </Card>
          <Card className="gap-2 py-4">
            <CardContent className="px-4">
              <p className="text-2xl font-semibold tabular-nums text-foreground">{kpis.totalCalls}</p>
              <p className="mt-1 text-xs text-muted-foreground">AI Calls</p>
            </CardContent>
          </Card>
          <Card className="gap-2 py-4">
            <CardContent className="px-4">
              <p className="text-2xl font-semibold tabular-nums text-foreground">{kpis.connectionRate}%</p>
              <p className="mt-1 text-xs text-muted-foreground">Connection Rate</p>
            </CardContent>
          </Card>
          <Card className="gap-2 py-4">
            <CardContent className="px-4">
              <p className="text-2xl font-semibold tabular-nums text-foreground">{kpis.qualificationRate}%</p>
              <p className="mt-1 text-xs text-muted-foreground">Qualification Rate</p>
            </CardContent>
          </Card>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>AI Calls Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <CallsOverTimeChart data={callsOverTime} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Candidate Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <CandidateFunnelChart data={funnel} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Call Outcomes</CardTitle>
            </CardHeader>
            <CardContent>
              <CallOutcomesChart data={outcomes} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Match Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <MatchDistributionChart data={distribution} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
