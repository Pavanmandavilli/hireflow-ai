"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Phone, MapPin, Briefcase, ExternalLink, PhoneOutgoing } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DemoBanner } from "@/components/shared/demo-banner";
import { ErrorAlert } from "@/components/shared/error-alert";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CandidateAvatar } from "@/components/shared/candidate-avatar";
import { StatusBadge } from "@/components/shared/status-badge";
import { MatchScoreLarge } from "@/components/shared/match-score";
import { SkillMatchList } from "@/components/candidates/skill-match-list";
import { ShortlistMenu } from "@/components/candidates/shortlist-menu";
import { CallHistoryTable } from "@/components/candidates/call-history-table";
import { useCandidates } from "@/hooks/use-candidates";
import { useJob } from "@/hooks/use-jobs";
import { useCalls } from "@/hooks/use-calls";
import { useShortlist } from "@/hooks/use-shortlist";
import { matchLabel, toMatchPercent } from "@/lib/format";
import { matchedSkills } from "@/lib/skill-match";
import { deriveScreeningStatus } from "@/lib/derive-status";
import { resolveStatus, SCREENING_STATUS_CONFIG } from "@/lib/status-config";
import { deriveAiRecommendation } from "@/lib/ai-recommendation";

export default function CandidateProfilePage({ params }: { params: Promise<{ candidateId: string }> }) {
  const { candidateId } = use(params);
  const id = Number(candidateId);
  const router = useRouter();

  const candidatesQuery = useCandidates();
  const candidate = candidatesQuery.data?.data.find((c) => c.id === id);

  const jobQuery = useJob(candidate?.job_id ?? undefined);
  const callsQuery = useCalls(candidate?.job_id ?? undefined);
  const { decisions, setDecision } = useShortlist();

  const candidateCalls = useMemo(
    () => (callsQuery.data?.data ?? []).filter((c) => c.candidate_id === id).sort((a, b) => b.id - a.id),
    [callsQuery.data, id],
  );

  if (candidatesQuery.isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  if (candidatesQuery.error) {
    return (
      <ErrorAlert
        message={candidatesQuery.error instanceof Error ? candidatesQuery.error.message : "Failed to load candidate."}
      />
    );
  }

  if (!candidate) {
    return (
      <EmptyState
        icon={Briefcase}
        title="Candidate not found"
        description="This candidate may have been removed or the link is incorrect."
      />
    );
  }

  const job = jobQuery.data?.data;
  const skillMatches = matchedSkills(candidate, job?.skills ?? []);
  const matchedCount = skillMatches.filter((s) => s.matched).length;
  const decision = decisions[candidate.id] ?? null;
  const status = deriveScreeningStatus(candidateCalls, decision);
  const pct = toMatchPercent(candidate.match_score);

  return (
    <div className="flex flex-col gap-6">
      {(candidatesQuery.data?.isDemo || jobQuery.data?.isDemo) && <DemoBanner />}

      <PageHeader
        title={
          <span className="flex items-center gap-3">
            <CandidateAvatar name={candidate.name} className="size-11" />
            <span className="flex flex-col">
              <span>{candidate.name}</span>
              <span className="text-sm font-normal text-muted-foreground">
                {candidate.title ?? "Role not specified"} {candidate.location ? `· ${candidate.location}` : ""}
              </span>
            </span>
          </span>
        }
        subtitle={pct !== null ? `${pct}% match — ${matchLabel(pct)}` : undefined}
        actions={
          <>
            <Button
              variant="outline"
              disabled={!candidate.phone || candidate.job_id === null}
              onClick={() => router.push(`/outreach?jobId=${candidate.job_id}&candidateIds=${candidate.id}`)}
            >
              <PhoneOutgoing />
              Start AI Call
            </Button>
            <ShortlistMenu decision={decision} onChange={(d) => setDecision(candidate.id, d)} />
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="size-4 text-muted-foreground" />
                {candidate.email ?? "Not available"}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="size-4 text-muted-foreground" />
                {candidate.phone ?? "Not available"}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="size-4 text-muted-foreground" />
                {candidate.location ?? "Not available"}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="size-4 text-muted-foreground" />
                {candidate.title ?? "Not available"}
              </div>
              {candidate.profile_url && (
                <a
                  href={candidate.profile_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                >
                  View source profile ({candidate.source ?? "external"})
                  <ExternalLink className="size-3.5" />
                </a>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-foreground">
                {deriveAiRecommendation(candidateCalls, candidate.match_score, matchedCount, skillMatches.length)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Call History</CardTitle>
            </CardHeader>
            <CardContent>
              {candidateCalls.length === 0 ? (
                <p className="text-sm text-muted-foreground">No AI calls yet for this candidate.</p>
              ) : (
                <CallHistoryTable calls={candidateCalls} />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Screening Status</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusBadge {...resolveStatus(SCREENING_STATUS_CONFIG, status)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Match Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <MatchScoreLarge score={candidate.match_score} />
              {job && (
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Skills for {job.title}
                  </p>
                  <SkillMatchList items={skillMatches} />
                </div>
              )}
            </CardContent>
          </Card>

          {job && (
            <Card>
              <CardHeader>
                <CardTitle>Applied For</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/jobs/${job.id}`} className="text-sm font-medium text-primary hover:underline">
                  {job.title}
                </Link>
                <p className="mt-1 text-sm text-muted-foreground">{job.location ?? "Remote"}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
