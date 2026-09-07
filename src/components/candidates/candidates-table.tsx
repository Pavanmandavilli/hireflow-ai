"use client";

import Link from "next/link";
import { PhoneCall, Eye } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CandidateAvatar } from "@/components/shared/candidate-avatar";
import { MatchScoreCell } from "@/components/shared/match-score";
import { StatusBadge } from "@/components/shared/status-badge";
import { resolveStatus, SCREENING_STATUS_CONFIG } from "@/lib/status-config";
import type { Candidate, ScreeningStatus } from "@/types/candidate";
import type { Job } from "@/types/job";

interface CandidatesTableProps {
  candidates: Candidate[];
  selectable?: boolean;
  selectedIds?: Set<number>;
  onToggle?: (id: number) => void;
  onToggleAll?: () => void;
  jobsById?: Map<number, Job>;
  statusFor?: (candidate: Candidate) => ScreeningStatus;
  onCall?: (candidate: Candidate) => void;
}

export function CandidatesTable({
  candidates,
  selectable,
  selectedIds,
  onToggle,
  onToggleAll,
  jobsById,
  statusFor,
  onCall,
}: CandidatesTableProps) {
  const allSelected = selectable && candidates.length > 0 && candidates.every((c) => selectedIds?.has(c.id));

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            {selectable && (
              <TableHead className="w-10">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={() => onToggleAll?.()}
                  aria-label="Select all candidates"
                />
              </TableHead>
            )}
            <TableHead>Candidate</TableHead>
            <TableHead>Current Role</TableHead>
            {jobsById && <TableHead>Job</TableHead>}
            <TableHead>Location</TableHead>
            <TableHead>Match</TableHead>
            {statusFor ? <TableHead>Status</TableHead> : <TableHead>Source</TableHead>}
            <TableHead className="w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate) => {
            const job = candidate.job_id !== null ? jobsById?.get(candidate.job_id) : undefined;
            const status = statusFor?.(candidate);
            return (
              <TableRow key={candidate.id}>
                {selectable && (
                  <TableCell>
                    <Checkbox
                      checked={selectedIds?.has(candidate.id) ?? false}
                      onCheckedChange={() => onToggle?.(candidate.id)}
                      aria-label={`Select ${candidate.name}`}
                    />
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <CandidateAvatar name={candidate.name} />
                    <div className="min-w-0">
                      <Link href={`/candidates/${candidate.id}`} className="block truncate font-medium text-foreground hover:underline">
                        {candidate.name}
                      </Link>
                      <span className="block truncate text-xs text-muted-foreground">{candidate.email ?? "No email on file"}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{candidate.title ?? "—"}</TableCell>
                {jobsById && <TableCell className="text-muted-foreground">{job?.title ?? "—"}</TableCell>}
                <TableCell className="text-muted-foreground">{candidate.location ?? "—"}</TableCell>
                <TableCell>
                  <MatchScoreCell score={candidate.match_score} />
                </TableCell>
                {status ? (
                  <TableCell>
                    <StatusBadge {...resolveStatus(SCREENING_STATUS_CONFIG, status)} />
                  </TableCell>
                ) : (
                  <TableCell className="text-muted-foreground">{candidate.source ?? "—"}</TableCell>
                )}
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" aria-label={`View ${candidate.name}`} asChild>
                      <Link href={`/candidates/${candidate.id}`}>
                        <Eye className="size-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Call ${candidate.name}`}
                      disabled={!candidate.phone}
                      onClick={() => onCall?.(candidate)}
                    >
                      <PhoneCall className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
