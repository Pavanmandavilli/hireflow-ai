"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { PhoneOutgoing } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DemoBanner } from "@/components/shared/demo-banner";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OutreachCandidatesTable } from "./outreach-candidates-table";
import { StartOutreachDialog } from "./start-outreach-dialog";
import { useJobs } from "@/hooks/use-jobs";
import { useCandidates } from "@/hooks/use-candidates";
import { useCalls, useCreateBulkCalls, useCreateCall } from "@/hooks/use-calls";
import { useHunarAgents, useHunarNumbers } from "@/hooks/use-hunar";
import { useCallingSettings } from "@/hooks/use-calling-settings";
import { ApiError } from "@/lib/api/client";
import type { Call } from "@/types/call";

export function OutreachContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { settings } = useCallingSettings();

  const jobsQuery = useJobs();
  const jobs = jobsQuery.data?.data ?? [];

  const initialJobId = searchParams.get("jobId");
  const [selectedJobId, setSelectedJobId] = useState<number | undefined>(
    initialJobId ? Number(initialJobId) : undefined,
  );

  const candidatesQuery = useCandidates(selectedJobId);
  const candidates = useMemo(() => candidatesQuery.data?.data ?? [], [candidatesQuery.data]);
  const callsQuery = useCalls(selectedJobId);
  const calls = useMemo(() => callsQuery.data?.data ?? [], [callsQuery.data]);

  const agentsQuery = useHunarAgents();
  const numbersQuery = useHunarNumbers();
  const agents = agentsQuery.data?.data ?? [];
  const numbers = numbersQuery.data?.data ?? [];

  // Undefined means "no explicit user choice yet" — fall back to the first loaded option
  // below. Computed during render rather than synced via effect+setState.
  const [agentId, setAgentId] = useState<string | undefined>();
  const [numberId, setNumberId] = useState<string | undefined>();
  const effectiveAgentId = agentId ?? agents[0]?.id;
  const effectiveNumberId = numberId ?? numbers[0]?.id;

  const [dialogOpen, setDialogOpen] = useState(false);

  // Selection starts from ?candidateIds=1,2,3 (once the job's candidates have loaded) and is
  // overridden the moment the user manually toggles anything — a derived value, not effect state.
  const initialSelected = useMemo(() => {
    const raw = searchParams.get("candidateIds");
    if (!raw) return new Set<number>();
    const ids = raw.split(",").map((v) => Number(v));
    return new Set(ids.filter((n) => candidates.some((c) => c.id === n)));
  }, [candidates, searchParams]);
  const [manualSelected, setManualSelected] = useState<Set<number> | null>(null);
  const selected = manualSelected ?? initialSelected;

  const latestCallByCandidate = useMemo(() => {
    const map = new Map<number, Call>();
    for (const call of calls) {
      const existing = map.get(call.candidate_id);
      if (!existing || call.id > existing.id) map.set(call.candidate_id, call);
    }
    return map;
  }, [calls]);

  const createCall = useCreateCall();
  const createBulkCalls = useCreateBulkCalls();
  const isSubmitting = createCall.isPending || createBulkCalls.isPending;

  function toggle(id: number) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setManualSelected(next);
  }

  function toggleAll() {
    setManualSelected(selected.size === candidates.length ? new Set() : new Set(candidates.map((c) => c.id)));
  }

  async function handleConfirm() {
    if (!effectiveAgentId) return;
    const selectedNumber = numbers.find((n) => n.id === effectiveNumberId);
    const candidateIds = Array.from(selected);

    try {
      if (candidateIds.length === 1) {
        await createCall.mutateAsync({
          candidate_id: candidateIds[0]!,
          agent_id: effectiveAgentId,
          from_phone_number: selectedNumber?.phone_number,
          timezone: settings.timezone,
          max_retry_count: settings.maxRetries,
        });
      } else {
        await createBulkCalls.mutateAsync({
          candidate_ids: candidateIds,
          agent_id: effectiveAgentId,
          from_phone_number: selectedNumber?.phone_number,
          timezone: settings.timezone,
          max_retry_count: settings.maxRetries,
        });
      }
      toast.success(
        candidateIds.length === 1 ? "AI call started successfully." : `AI outreach started for ${candidateIds.length} candidates.`,
      );
      setDialogOpen(false);
      router.push("/calls");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Unable to start the call. Please verify the candidate's phone number.";
      toast.error(message);
    }
  }

  const selectedJob = jobs.find((j) => j.id === selectedJobId);
  const selectedAgent = agents.find((a) => a.id === effectiveAgentId);
  const selectedNumber = numbers.find((n) => n.id === effectiveNumberId);
  const selectedCandidateNames = candidates.filter((c) => selected.has(c.id)).map((c) => c.name);

  const isDemo =
    jobsQuery.data?.isDemo || candidatesQuery.data?.isDemo || agentsQuery.data?.isDemo || numbersQuery.data?.isDemo;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="AI Outreach" subtitle="Use AI voice agents to screen and engage candidates." />

      {isDemo && <DemoBanner />}

      <Card>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="outreach-job">Select Job</Label>
            <Select
              value={selectedJobId ? String(selectedJobId) : ""}
              onValueChange={(v) => {
                setSelectedJobId(Number(v));
                setManualSelected(new Set());
              }}
            >
              <SelectTrigger id="outreach-job" className="w-full">
                <SelectValue placeholder="Choose a job" />
              </SelectTrigger>
              <SelectContent>
                {jobs.map((job) => (
                  <SelectItem key={job.id} value={String(job.id)}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="outreach-agent">Select AI Agent</Label>
            <Select value={effectiveAgentId ?? ""} onValueChange={setAgentId}>
              <SelectTrigger id="outreach-agent" className="w-full">
                <SelectValue placeholder={agentsQuery.isLoading ? "Loading agents..." : "Choose an agent"} />
              </SelectTrigger>
              <SelectContent>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="outreach-number">Select From Number</Label>
            <Select value={effectiveNumberId ?? ""} onValueChange={setNumberId}>
              <SelectTrigger id="outreach-number" className="w-full">
                <SelectValue placeholder={numbersQuery.isLoading ? "Loading numbers..." : "Choose a number"} />
              </SelectTrigger>
              <SelectContent>
                {numbers.map((number) => (
                  <SelectItem key={number.id} value={number.id}>
                    {number.label ? `${number.label} — ${number.phone_number}` : number.phone_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {!selectedJobId ? (
        <EmptyState
          icon={PhoneOutgoing}
          title="Select a job to begin"
          description="Choose a job above to see its sourced candidates and start AI outreach."
        />
      ) : candidatesQuery.isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-md" />
          ))}
        </div>
      ) : candidates.length === 0 ? (
        <EmptyState
          icon={PhoneOutgoing}
          title="No candidates to call"
          description="Find candidates for this job first, then come back to start outreach."
          action={
            <Button size="sm" onClick={() => router.push(`/jobs/${selectedJobId}/candidates`)}>
              Find Candidates
            </Button>
          }
        />
      ) : (
        <>
          <OutreachCandidatesTable
            candidates={candidates}
            job={selectedJob}
            selectedIds={selected}
            onToggle={toggle}
            onToggleAll={toggleAll}
            latestCallByCandidate={latestCallByCandidate}
          />

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {selected.size} of {candidates.length} candidates selected
            </p>
            <Button
              disabled={selected.size === 0 || !effectiveAgentId || !effectiveNumberId}
              onClick={() => setDialogOpen(true)}
            >
              <PhoneOutgoing />
              Start AI Outreach
            </Button>
          </div>
        </>
      )}

      <StartOutreachDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        agentName={selectedAgent?.name ?? "—"}
        numberLabel={selectedNumber?.phone_number ?? "—"}
        candidateNames={selectedCandidateNames}
        isSubmitting={isSubmitting}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
