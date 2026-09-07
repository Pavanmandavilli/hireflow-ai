import type { Call } from "@/types/call";
import { callRecommendation, callConversationSummary } from "@/lib/call-result";
import { matchLabel, toMatchPercent } from "@/lib/format";

/**
 * Prefers the real recommendation/summary from a completed screening call.
 * Only falls back to a generic, honestly-derived sentence (match score +
 * skills actually detected in the profile text) when no call has completed —
 * never invents specifics about the candidate that weren't actually derived.
 */
export function deriveAiRecommendation(
  calls: Call[],
  matchScore: number | null,
  matchedCount: number,
  totalSkills: number,
): string {
  const completed = calls.filter((c) => c.status === "COMPLETED").sort((a, b) => b.id - a.id);
  for (const call of completed) {
    const recommendation = callRecommendation(call.result);
    const summary = callConversationSummary(call.result);
    if (recommendation && summary) return `${summary} (AI recommendation: ${recommendation}.)`;
    if (summary) return summary;
    if (recommendation) return `AI recommendation from the screening call: ${recommendation}.`;
  }

  const pct = toMatchPercent(matchScore);
  if (pct === null) return "This candidate hasn't been scored against this role yet.";

  const label = matchLabel(pct).toLowerCase();
  const skillsNote =
    totalSkills > 0 ? ` with ${matchedCount} of ${totalSkills} required skills detected in their profile` : "";
  return `${label[0]!.toUpperCase()}${label.slice(1)} for this position${skillsNote}. Run an AI screening call to confirm fit.`;
}
