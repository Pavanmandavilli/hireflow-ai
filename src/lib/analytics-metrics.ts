import type { Candidate } from "@/types/candidate";
import type { Call } from "@/types/call";
import { isInterestedCall, isQualifiedCall } from "@/lib/call-result";
import { toMatchPercent } from "@/lib/format";

export interface AnalyticsKpis {
  totalCandidates: number;
  totalCalls: number;
  connectionRate: number;
  qualificationRate: number;
}

export function computeAnalyticsKpis(candidates: Candidate[], calls: Call[]): AnalyticsKpis {
  const connected = calls.filter((c) => c.status === "CONNECTED" || c.status === "COMPLETED").length;
  const completed = calls.filter((c) => c.status === "COMPLETED");
  const qualified = completed.filter(isQualifiedCall).length;

  return {
    totalCandidates: candidates.length,
    totalCalls: calls.length,
    connectionRate: calls.length > 0 ? Math.round((connected / calls.length) * 100) : 0,
    qualificationRate: completed.length > 0 ? Math.round((qualified / completed.length) * 100) : 0,
  };
}

export interface CallsByDay {
  date: string;
  calls: number;
}

export function computeCallsOverTime(calls: Call[], days = 14): CallsByDay[] {
  const buckets = new Map<string, number>();
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, 0);
  }
  for (const call of calls) {
    const key = call.created_at?.slice(0, 10);
    if (key && buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  return Array.from(buckets.entries()).map(([date, calls]) => ({
    date: new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short" }).format(new Date(date)),
    calls,
  }));
}

export interface FunnelStage {
  stage: string;
  count: number;
}

export function computeCandidateFunnel(candidates: Candidate[], calls: Call[]): FunnelStage[] {
  const byCandidate = new Map<number, Call[]>();
  for (const call of calls) {
    const list = byCandidate.get(call.candidate_id) ?? [];
    list.push(call);
    byCandidate.set(call.candidate_id, list);
  }

  let contacted = 0;
  let connected = 0;
  let screened = 0;
  let qualified = 0;

  for (const candidate of candidates) {
    const candidateCalls = byCandidate.get(candidate.id) ?? [];
    if (candidateCalls.length > 0) contacted += 1;
    if (candidateCalls.some((c) => c.status === "CONNECTED" || c.status === "COMPLETED")) connected += 1;
    const completed = candidateCalls.filter((c) => c.status === "COMPLETED");
    if (completed.length > 0) screened += 1;
    if (completed.some(isQualifiedCall)) qualified += 1;
  }

  return [
    { stage: "Sourced", count: candidates.length },
    { stage: "Contacted", count: contacted },
    { stage: "Connected", count: connected },
    { stage: "Screened", count: screened },
    { stage: "Qualified", count: qualified },
  ];
}

export interface OutcomeSlice {
  outcome: string;
  count: number;
}

export function computeCallOutcomes(calls: Call[]): OutcomeSlice[] {
  const completed = calls.filter((c) => c.status === "COMPLETED");
  const interested = completed.filter(isInterestedCall).length;
  const notInterested = completed.length - interested;
  const noAnswer = calls.filter((c) => c.status === "NOT_CONNECTED").length;
  const failed = calls.filter((c) => c.status === "FAILED").length;

  return [
    { outcome: "Interested", count: interested },
    { outcome: "Not Interested", count: notInterested },
    { outcome: "No Answer", count: noAnswer },
    { outcome: "Failed", count: failed },
  ];
}

export interface MatchBucket {
  bucket: string;
  count: number;
}

export function computeMatchDistribution(candidates: Candidate[]): MatchBucket[] {
  const buckets = { "90-100": 0, "80-90": 0, "70-80": 0, "Below 70": 0 };
  for (const candidate of candidates) {
    const pct = toMatchPercent(candidate.match_score);
    if (pct === null) continue;
    if (pct >= 90) buckets["90-100"] += 1;
    else if (pct >= 80) buckets["80-90"] += 1;
    else if (pct >= 70) buckets["70-80"] += 1;
    else buckets["Below 70"] += 1;
  }
  return Object.entries(buckets).map(([bucket, count]) => ({ bucket, count }));
}
