"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { candidatesApi } from "@/lib/api/candidates";
import { withDemoFallback } from "@/lib/api/with-fallback";
import { DEMO_CANDIDATES } from "@/lib/demo-data";
import type { CandidateSearchInput } from "@/types/candidate";
import { jobsKeys } from "./use-jobs";

export const candidatesKeys = {
  all: ["candidates"] as const,
  list: (jobId?: number) => ["candidates", { jobId: jobId ?? "all" }] as const,
};

export function useCandidates(jobId?: number) {
  return useQuery({
    queryKey: candidatesKeys.list(jobId),
    queryFn: ({ signal }) =>
      withDemoFallback(
        () => candidatesApi.list(jobId, signal),
        jobId ? DEMO_CANDIDATES.filter((c) => c.job_id === jobId) : DEMO_CANDIDATES,
      ),
  });
}

/**
 * The backend persists every search result against the job (upsert_candidate),
 * so a successful search also invalidates that job's candidate list and the
 * job detail (candidate counts change).
 */
export function useCandidateSearch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CandidateSearchInput) =>
      withDemoFallback(
        () => candidatesApi.search(input),
        DEMO_CANDIDATES.filter((c) => c.job_id === input.job_id).slice(0, input.limit ?? 10),
      ),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: candidatesKeys.list(variables.job_id) });
      queryClient.invalidateQueries({ queryKey: jobsKeys.detail(variables.job_id) });
    },
  });
}
