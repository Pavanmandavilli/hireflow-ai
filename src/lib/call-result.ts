import type { Call, CallResult } from "@/types/call";

export function isQualifiedCall(call: Call): boolean {
  const result = call.result;
  if (!result) return false;
  const qualified = result["qualified"];
  if (typeof qualified === "boolean") return qualified;
  if (typeof qualified === "string") return /^(yes|true)$/i.test(qualified);
  const recommendation = result["recommendation"];
  if (typeof recommendation === "string") return /shortlist|qualify|qualified|hire/i.test(recommendation);
  return false;
}

export function isInterestedCall(call: Call): boolean {
  const interested = call.result?.["interested"];
  if (typeof interested === "boolean") return interested;
  if (typeof interested === "string") return /^(yes|true)$/i.test(interested);
  return false;
}

/** Short summary shown in the calls table "Result" column. */
export function callResultSummary(result: CallResult | null | undefined): string {
  if (!result) return "—";
  const recommendation = result["recommendation"];
  if (typeof recommendation === "string" && recommendation.trim()) return recommendation;
  const qualified = result["qualified"];
  if (typeof qualified === "boolean") return qualified ? "Qualified" : "Not Qualified";
  if (typeof qualified === "string") return /^(yes|true)$/i.test(qualified) ? "Qualified" : "Not Qualified";
  return "—";
}

const SUMMARY_KEYS = ["summary", "conversation_summary", "call_summary"];

export function callConversationSummary(result: CallResult | null | undefined): string | null {
  if (!result) return null;
  for (const key of SUMMARY_KEYS) {
    const value = result[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return null;
}

export function callRecommendation(result: CallResult | null | undefined): string | null {
  if (!result) return null;
  const recommendation = result["recommendation"];
  return typeof recommendation === "string" && recommendation.trim() ? recommendation : null;
}
