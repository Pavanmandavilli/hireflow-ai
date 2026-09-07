import type { Candidate } from "@/types/candidate";
import type { Call } from "@/types/call";
import type { ShortlistDecision } from "@/hooks/use-shortlist";
import { isQualifiedCall } from "@/lib/call-result";

export interface JobStats {
  candidateCount: number;
  qualifiedCount: number;
}

export function computeJobStats(
  candidates: Candidate[],
  calls: Call[],
  decisions: Record<number, ShortlistDecision>,
): Map<number, JobStats> {
  const stats = new Map<number, JobStats>();
  const qualifiedCandidateIds = new Set(
    calls.filter((c) => c.status === "COMPLETED" && isQualifiedCall(c)).map((c) => c.candidate_id),
  );

  for (const candidate of candidates) {
    if (candidate.job_id === null) continue;
    const entry = stats.get(candidate.job_id) ?? { candidateCount: 0, qualifiedCount: 0 };
    entry.candidateCount += 1;
    if (qualifiedCandidateIds.has(candidate.id) || decisions[candidate.id] === "shortlisted" || decisions[candidate.id] === "hired") {
      entry.qualifiedCount += 1;
    }
    stats.set(candidate.job_id, entry);
  }
  return stats;
}
