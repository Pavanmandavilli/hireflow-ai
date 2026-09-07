"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, SearchX } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DemoBanner } from "@/components/shared/demo-banner";
import { ErrorAlert } from "@/components/shared/error-alert";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { CandidateSearchPanel } from "@/components/candidates/candidate-search-panel";
import { CandidatesTable } from "@/components/candidates/candidates-table";
import { SelectionBar } from "@/components/candidates/selection-bar";
import { useJob } from "@/hooks/use-jobs";
import { useCandidateSearch, useCandidates } from "@/hooks/use-candidates";
import { ApiError } from "@/lib/api/client";

export default function CandidateSearchPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = use(params);
  const id = Number(jobId);
  const router = useRouter();

  const jobQuery = useJob(Number.isFinite(id) ? id : undefined);
  const candidatesQuery = useCandidates(id);
  const search = useCandidateSearch();
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [hasSearched, setHasSearched] = useState(false);

  const candidates = candidatesQuery.data?.data ?? [];

  function toggle(candidateId: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(candidateId)) next.delete(candidateId);
      else next.add(candidateId);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) => (prev.size === candidates.length ? new Set() : new Set(candidates.map((c) => c.id))));
  }

  async function handleSearch({ location, limit }: { location: string; limit: number }) {
    try {
      await search.mutateAsync({ job_id: id, location: location || undefined, limit });
      setHasSearched(true);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Unable to search for candidates. Please try again.";
      toast.error(message);
    }
  }

  if (jobQuery.isLoading) {
    return <Skeleton className="h-96 rounded-lg" />;
  }

  if (jobQuery.error || !jobQuery.data) {
    return <ErrorAlert title="Job not found" message="We couldn't find that job." />;
  }

  const job = jobQuery.data.data;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Find Candidates" subtitle={`Discover candidates who match ${job.title}.`} />

      {(jobQuery.data.isDemo || candidatesQuery.data?.isDemo) && <DemoBanner />}

      <CandidateSearchPanel
        defaultLocation={job.location ?? ""}
        isSearching={search.isPending}
        onSearch={handleSearch}
      />

      {search.isPending ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Searching for candidates...</p>
        </div>
      ) : candidatesQuery.isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-md" />
          ))}
        </div>
      ) : candidates.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No candidates found"
          description={
            hasSearched
              ? "No candidates found for this search. Try a different location or widen the candidate count."
              : "Run a search above to discover candidates for this role."
          }
        />
      ) : (
        <CandidatesTable
          candidates={candidates}
          selectable
          selectedIds={selected}
          onToggle={toggle}
          onToggleAll={toggleAll}
          onCall={(c) => router.push(`/outreach?jobId=${id}&candidateIds=${c.id}`)}
        />
      )}

      <SelectionBar
        count={selected.size}
        onClear={() => setSelected(new Set())}
        onStartOutreach={() => router.push(`/outreach?jobId=${id}&candidateIds=${Array.from(selected).join(",")}`)}
      />
    </div>
  );
}
