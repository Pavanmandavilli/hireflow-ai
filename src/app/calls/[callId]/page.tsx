"use client";

import { use } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DemoBanner } from "@/components/shared/demo-banner";
import { ErrorAlert } from "@/components/shared/error-alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CandidateAvatar } from "@/components/shared/candidate-avatar";
import { CallStatusBadge } from "@/components/calls/call-status-badge";
import { CallTimeline } from "@/components/calls/call-timeline";
import { CallResultGrid } from "@/components/calls/call-result-grid";
import { useCall } from "@/hooks/use-calls";
import { useCandidates } from "@/hooks/use-candidates";
import { useJob } from "@/hooks/use-jobs";
import { formatDateTime, formatDuration } from "@/lib/format";
import { callConversationSummary, callRecommendation } from "@/lib/call-result";

export default function CallDetailPage({ params }: { params: Promise<{ callId: string }> }) {
  const { callId } = use(params);
  const id = Number(callId);
  const callQuery = useCall(Number.isFinite(id) ? id : undefined);
  const candidatesQuery = useCandidates();

  const call = callQuery.data?.data;
  const candidate = call ? candidatesQuery.data?.data.find((c) => c.id === call.candidate_id) : undefined;
  const jobQuery = useJob(call?.job_id ?? undefined);

  if (callQuery.isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  if (callQuery.error || !call) {
    return (
      <ErrorAlert
        title="Call not found"
        message={callQuery.error instanceof Error ? callQuery.error.message : "We couldn't find that call."}
      />
    );
  }

  const summary = callConversationSummary(call.result);
  const recommendation = callRecommendation(call.result);
  const job = jobQuery.data?.data;

  return (
    <div className="flex flex-col gap-6">
      {callQuery.data?.isDemo && <DemoBanner />}

      <PageHeader
        title={
          <span className="flex items-center gap-3">
            <CandidateAvatar name={candidate?.name ?? `Candidate #${call.candidate_id}`} className="size-10" />
            {candidate?.name ?? `Candidate #${call.candidate_id}`}
          </span>
        }
        subtitle={
          <span className="flex items-center gap-2">
            <CallStatusBadge status={call.status} />
            <span>{formatDuration(call.duration_seconds)}</span>
            {job && (
              <>
                <span>·</span>
                <Link href={`/jobs/${job.id}`} className="hover:underline">
                  {job.title}
                </Link>
              </>
            )}
          </span>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Call Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CallTimeline status={call.status} />
              <p className="text-sm leading-relaxed text-foreground">
                {summary ?? "No conversation summary available for this call."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Screening Results</CardTitle>
            </CardHeader>
            <CardContent>
              {call.result ? (
                <CallResultGrid result={call.result} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {call.status === "COMPLETED"
                    ? "No structured screening results were returned."
                    : "Results will appear once the call completes."}
                </p>
              )}
            </CardContent>
          </Card>

          {call.recording_url && (
            <Card>
              <CardHeader>
                <CardTitle>Recording</CardTitle>
              </CardHeader>
              <CardContent>
                <audio controls src={call.recording_url} className="w-full" />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Evaluation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground">
                {recommendation ?? "No recommendation returned yet for this call."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Call Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-y-2 text-sm">
                <dt className="text-muted-foreground">Agent</dt>
                <dd className="text-right text-foreground">{call.agent_id}</dd>
                <dt className="text-muted-foreground">Hunar Call ID</dt>
                <dd className="truncate text-right text-foreground">{call.hunar_call_id ?? "—"}</dd>
                <dt className="text-muted-foreground">Request ID</dt>
                <dd className="truncate text-right text-foreground">{call.request_id ?? "—"}</dd>
                <dt className="text-muted-foreground">Started</dt>
                <dd className="text-right text-foreground">{formatDateTime(call.created_at)}</dd>
                <dt className="text-muted-foreground">Updated</dt>
                <dd className="text-right text-foreground">{formatDateTime(call.updated_at)}</dd>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
