import { StatusBadge } from "@/components/shared/status-badge";
import { JOB_STATUS_CONFIG, resolveStatus } from "@/lib/status-config";

export function JobStatusBadge({ status }: { status: string }) {
  const { label, tone } = resolveStatus(JOB_STATUS_CONFIG, status);
  return <StatusBadge label={label} tone={tone} />;
}
