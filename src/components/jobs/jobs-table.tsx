"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { JobStatusBadge } from "./job-status-badge";
import { formatDate, formatExperienceRange } from "@/lib/format";
import type { Job } from "@/types/job";
import type { JobStats } from "@/lib/job-metrics";

export function JobsTable({ jobs, stats }: { jobs: Job[]; stats: Map<number, JobStats> }) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead className="text-right">Candidates</TableHead>
            <TableHead className="text-right">Qualified</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => {
            const jobStats = stats.get(job.id) ?? { candidateCount: 0, qualifiedCount: 0 };
            return (
              <TableRow
                key={job.id}
                className="cursor-pointer"
                onClick={() => router.push(`/jobs/${job.id}`)}
              >
                <TableCell className="font-medium text-foreground">
                  <Link href={`/jobs/${job.id}`} className="hover:underline" onClick={(e) => e.stopPropagation()}>
                    {job.title}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{job.location ?? "Remote"}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatExperienceRange(job.experience_min, job.experience_max)}
                </TableCell>
                <TableCell className="text-right tabular-nums">{jobStats.candidateCount}</TableCell>
                <TableCell className="text-right tabular-nums">{jobStats.qualifiedCount}</TableCell>
                <TableCell>
                  <JobStatusBadge status={job.status} />
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(job.created_at)}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label={`Actions for ${job.title}`}>
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/jobs/${job.id}`}>
                          <Eye />
                          View Job
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/jobs/${job.id}/candidates`}>
                          <Search />
                          Find Candidates
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
