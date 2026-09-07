import type { Call } from "@/types/call";
import type { ScreeningStatus } from "@/types/candidate";
import { isQualifiedCall as isQualified } from "@/lib/call-result";

/**
 * The backend has no single "status" field on a candidate — this derives one
 * from that candidate's call history plus the local shortlist decision
 * (see hooks/use-shortlist.ts), which is a recruiter-only UI action that
 * isn't persisted server-side.
 */
export function deriveScreeningStatus(
  calls: Call[],
  shortlistState: "shortlisted" | "rejected" | "hired" | null,
): ScreeningStatus {
  if (shortlistState === "hired") return "Hired";
  if (shortlistState === "shortlisted") return "Shortlisted";
  if (shortlistState === "rejected") return "Rejected";
  if (calls.length === 0) return "Not Contacted";

  const completed = calls.filter((c) => c.status === "COMPLETED");
  if (completed.some(isQualified)) return "Qualified";
  if (completed.length > 0) return "Screened";
  return "Contacted";
}

export const SCREENING_STATUS_TONE: Record<ScreeningStatus, "neutral" | "info" | "success" | "warning" | "danger"> = {
  "Not Contacted": "neutral",
  Contacted: "info",
  Screened: "info",
  Qualified: "success",
  Shortlisted: "success",
  Hired: "success",
  Rejected: "danger",
};
