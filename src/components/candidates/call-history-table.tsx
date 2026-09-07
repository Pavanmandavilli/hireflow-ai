import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CallStatusBadge } from "@/components/calls/call-status-badge";
import { formatDateTime, formatDuration } from "@/lib/format";
import { callResultSummary } from "@/lib/call-result";
import type { Call } from "@/types/call";

export function CallHistoryTable({ calls }: { calls: Call[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Result</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calls.map((call) => (
            <TableRow key={call.id}>
              <TableCell>
                <Link href={`/calls/${call.id}`} className="text-foreground hover:underline">
                  {formatDateTime(call.created_at)}
                </Link>
              </TableCell>
              <TableCell>
                <CallStatusBadge status={call.status} />
              </TableCell>
              <TableCell className="text-muted-foreground tabular-nums">{formatDuration(call.duration_seconds)}</TableCell>
              <TableCell className="text-muted-foreground">{callResultSummary(call.result)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
