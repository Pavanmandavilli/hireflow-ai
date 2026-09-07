import type { Job } from "@/types/job";
import type { Candidate } from "@/types/candidate";
import type { Call } from "@/types/call";
import type { ShortlistDecision } from "@/hooks/use-shortlist";
import { isInterestedCall, isQualifiedCall } from "@/lib/call-result";

function within(iso: string | null | undefined, msAgo: number): boolean {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return false;
  return Date.now() - t <= msAgo;
}

const DAY = 24 * 60 * 60 * 1000;
const WEEK = 7 * DAY;

export interface Trend {
  /** Count in the last 7 days. */
  current: number;
  /** Count in the 7 days before that. */
  previous: number;
  /** Percent change, null when there's no prior-period baseline to compare against. */
  percent: number | null;
}

function trendFor(timestamps: (string | null | undefined)[]): Trend {
  const current = timestamps.filter((t) => within(t, WEEK)).length;
  const previous = timestamps.filter((t) => {
    if (!t) return false;
    const age = Date.now() - new Date(t).getTime();
    return age > WEEK && age <= WEEK * 2;
  }).length;
  const percent = previous > 0 ? Math.round(((current - previous) / previous) * 100) : null;
  return { current, previous, percent };
}

export interface KpiMetrics {
  openJobs: number;
  openJobsTrend: Trend;
  totalCandidates: number;
  candidatesTrend: Trend;
  totalCalls: number;
  callsTrend: Trend;
  qualifiedCandidates: number;
  qualifiedTrend: Trend;
}

export function computeKpis(jobs: Job[], candidates: Candidate[], calls: Call[]): KpiMetrics {
  const candidateHasQualifiedCall = new Set(
    calls.filter((c) => c.status === "COMPLETED" && isQualifiedCall(c)).map((c) => c.candidate_id),
  );

  return {
    openJobs: jobs.filter((j) => j.status === "OPEN").length,
    openJobsTrend: trendFor(jobs.filter((j) => j.status === "OPEN").map((j) => j.created_at)),
    totalCandidates: candidates.length,
    candidatesTrend: trendFor(candidates.map(() => null)), // backend doesn't return candidate created_at
    totalCalls: calls.length,
    callsTrend: trendFor(calls.map((c) => c.created_at)),
    qualifiedCandidates: candidateHasQualifiedCall.size,
    qualifiedTrend: trendFor(
      calls.filter((c) => c.status === "COMPLETED" && isQualifiedCall(c)).map((c) => c.updated_at ?? c.created_at),
    ),
  };
}

export interface PipelineStage {
  key: string;
  label: string;
  count: number;
}

export function computePipeline(
  candidates: Candidate[],
  calls: Call[],
  decisions: Record<number, ShortlistDecision>,
): PipelineStage[] {
  const callsByCandidate = new Map<number, Call[]>();
  for (const call of calls) {
    const list = callsByCandidate.get(call.candidate_id) ?? [];
    list.push(call);
    callsByCandidate.set(call.candidate_id, list);
  }

  let contacted = 0;
  let screening = 0;
  let qualified = 0;
  let shortlisted = 0;
  let hired = 0;

  for (const candidate of candidates) {
    const candidateCalls = callsByCandidate.get(candidate.id) ?? [];
    const decision = decisions[candidate.id];
    if (candidateCalls.length > 0) contacted += 1;
    const completed = candidateCalls.filter((c) => c.status === "COMPLETED");
    if (completed.length > 0) screening += 1;
    if (completed.some(isQualifiedCall)) qualified += 1;
    if (decision === "shortlisted" || decision === "hired") shortlisted += 1;
    if (decision === "hired") hired += 1;
  }

  return [
    { key: "sourced", label: "Sourced", count: candidates.length },
    { key: "contacted", label: "Contacted", count: contacted },
    { key: "screening", label: "AI Screening", count: screening },
    { key: "qualified", label: "Qualified", count: qualified },
    { key: "shortlisted", label: "Shortlisted", count: shortlisted },
    { key: "hired", label: "Hired", count: hired },
  ];
}

export interface OutreachSummary {
  callsToday: number;
  connected: number;
  interested: number;
  qualified: number;
}

export function computeOutreachSummary(calls: Call[]): OutreachSummary {
  const callsToday = calls.filter((c) => within(c.created_at, DAY)).length;
  const connected = calls.filter((c) => c.status === "CONNECTED" || c.status === "COMPLETED").length;
  const completed = calls.filter((c) => c.status === "COMPLETED");
  const interested = completed.filter(isInterestedCall).length;
  const qualified = completed.filter(isQualifiedCall).length;
  return { callsToday, connected, interested, qualified };
}

export interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
}

export function computeRecentActivity(jobs: Job[], candidates: Candidate[], calls: Call[]): ActivityItem[] {
  const jobById = new Map(jobs.map((j) => [j.id, j] as const));
  const candidateById = new Map(candidates.map((c) => [c.id, c] as const));

  const items: ActivityItem[] = [];

  for (const call of calls) {
    const candidate = candidateById.get(call.candidate_id);
    const name = candidate?.name ?? `Candidate #${call.candidate_id}`;
    if (call.status === "COMPLETED") {
      const qualified = isQualifiedCall(call);
      items.push({
        id: `call-${call.id}`,
        title: "AI screening completed",
        detail: qualified ? `${name} was qualified.` : `${name} completed screening.`,
        timestamp: call.updated_at ?? call.created_at,
      });
    } else if (call.status === "CALLING" || call.status === "CONNECTED") {
      items.push({
        id: `call-active-${call.id}`,
        title: "AI outreach in progress",
        detail: `Calling ${name} now.`,
        timestamp: call.created_at,
      });
    } else if (call.status === "QUEUED") {
      items.push({
        id: `call-queued-${call.id}`,
        title: "AI outreach queued",
        detail: `${name} is queued for an AI screening call.`,
        timestamp: call.created_at,
      });
    }
  }

  // Group newly-sourced candidates per job into a single "search completed" event.
  const candidatesByJob = new Map<number, Candidate[]>();
  for (const c of candidates) {
    if (c.job_id === null) continue;
    const list = candidatesByJob.get(c.job_id) ?? [];
    list.push(c);
    candidatesByJob.set(c.job_id, list);
  }
  for (const [jobId, list] of candidatesByJob) {
    const job = jobById.get(jobId);
    items.push({
      id: `search-${jobId}`,
      title: "Candidate search completed",
      detail: `${list.length} candidate${list.length === 1 ? "" : "s"} found for ${job?.title ?? "a role"}.`,
      timestamp: job?.created_at ?? new Date().toISOString(),
    });
  }

  return items
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8);
}
