import { StatusBadge } from "@/components/shared/status-badge";
import { CALL_STATUS_CONFIG, resolveStatus } from "@/lib/status-config";

export function CallStatusBadge({ status }: { status: string }) {
  const { label, tone } = resolveStatus(CALL_STATUS_CONFIG, status);
  return <StatusBadge label={label} tone={tone} />;
}
