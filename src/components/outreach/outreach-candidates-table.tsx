"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CandidateAvatar } from "@/components/shared/candidate-avatar";
import { MatchScoreCell } from "@/components/shared/match-score";
import { StatusBadge } from "@/components/shared/status-badge";
import { CallStatusBadge } from "@/components/calls/call-status-badge";
import type { Candidate } from "@/types/candidate";
import type { Call } from "@/types/call";
import type { Job } from "@/types/job";

export function OutreachCandidatesTable({
  candidates,
  job,
  selectedIds,
  onToggle,
  onToggleAll,
  latestCallByCandidate,
}: {
  candidates: Candidate[];
  job: Job | undefined;
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
  onToggleAll: () => void;
  latestCallByCandidate: Map<number, Call>;
}) {
  const allSelected = candidates.length > 0 && candidates.every((c) => selectedIds.has(c.id));

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox checked={allSelected} onCheckedChange={() => onToggleAll()} aria-label="Select all candidates" />
            </TableHead>
            <TableHead>Candidate</TableHead>
            <TableHead>Job</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Match</TableHead>
            <TableHead>Call Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate) => {
            const call = latestCallByCandidate.get(candidate.id);
            return (
              <TableRow key={candidate.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(candidate.id)}
                    onCheckedChange={() => onToggle(candidate.id)}
                    aria-label={`Select ${candidate.name}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <CandidateAvatar name={candidate.name} />
                    <span className="font-medium text-foreground">{candidate.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{job?.title ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{candidate.phone ?? "Not available"}</TableCell>
                <TableCell>
                  <MatchScoreCell score={candidate.match_score} />
                </TableCell>
                <TableCell>
                  {call ? <CallStatusBadge status={call.status} /> : <StatusBadge label="Not Contacted" tone="neutral" />}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
