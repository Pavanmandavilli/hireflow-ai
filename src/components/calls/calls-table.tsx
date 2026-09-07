"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CandidateAvatar } from "@/components/shared/candidate-avatar";
import { CallStatusBadge } from "./call-status-badge";
import { formatDateTime, formatDuration } from "@/lib/format";
import { callResultSummary } from "@/lib/call-result";
import type { Call } from "@/types/call";
import type { Candidate } from "@/types/candidate";
import type { Job } from "@/types/job";

export function CallsTable({
  calls,
  candidatesById,
  jobsById,
  onSelect,
  showJobColumn = true,
}: {
  calls: Call[];
  candidatesById: Map<number, Candidate>;
  jobsById: Map<number, Job>;
  onSelect: (call: Call) => void;
  showJobColumn?: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Candidate</TableHead>
            {showJobColumn && <TableHead>Job</TableHead>}
            <TableHead>Agent</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Result</TableHead>
            <TableHead>Started</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calls.map((call) => {
            const candidate = candidatesById.get(call.candidate_id);
            const job = call.job_id !== null ? jobsById.get(call.job_id) : undefined;
            return (
              <TableRow key={call.id} className="cursor-pointer" onClick={() => onSelect(call)}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <CandidateAvatar name={candidate?.name ?? `Candidate #${call.candidate_id}`} />
                    <span className="font-medium text-foreground">
                      {candidate?.name ?? `Candidate #${call.candidate_id}`}
                    </span>
                  </div>
                </TableCell>
                {showJobColumn && <TableCell className="text-muted-foreground">{job?.title ?? "—"}</TableCell>}
                <TableCell className="text-muted-foreground">{call.agent_id}</TableCell>
                <TableCell>
                  <CallStatusBadge status={call.status} />
                </TableCell>
                <TableCell className="text-muted-foreground tabular-nums">{formatDuration(call.duration_seconds)}</TableCell>
                <TableCell className="text-muted-foreground">{callResultSummary(call.result)}</TableCell>
                <TableCell className="text-muted-foreground">{formatDateTime(call.created_at)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
