export type StatusTone = "neutral" | "info" | "success" | "warning" | "danger";

export const JOB_STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  OPEN: { label: "Open", tone: "success" },
  PAUSED: { label: "Paused", tone: "warning" },
  CLOSED: { label: "Closed", tone: "neutral" },
};

export const CALL_STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  QUEUED: { label: "Queued", tone: "neutral" },
  CALLING: { label: "Calling", tone: "info" },
  CONNECTED: { label: "Connected", tone: "info" },
  COMPLETED: { label: "Completed", tone: "success" },
  NOT_CONNECTED: { label: "Not Connected", tone: "warning" },
  FAILED: { label: "Failed", tone: "danger" },
  CANCELLED: { label: "Cancelled", tone: "neutral" },
};

export const SCREENING_STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  "Not Contacted": { label: "Not Contacted", tone: "neutral" },
  Contacted: { label: "Contacted", tone: "info" },
  Screened: { label: "Screened", tone: "info" },
  Qualified: { label: "Qualified", tone: "success" },
  Shortlisted: { label: "Shortlisted", tone: "success" },
  Hired: { label: "Hired", tone: "success" },
  Rejected: { label: "Rejected", tone: "danger" },
};

export function resolveStatus(
  config: Record<string, { label: string; tone: StatusTone }>,
  status: string,
): { label: string; tone: StatusTone } {
  return config[status] ?? { label: status, tone: "neutral" };
}
