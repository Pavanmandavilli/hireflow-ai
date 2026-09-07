"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { jobsApi } from "@/lib/api/jobs";
import { withDemoFallback } from "@/lib/api/with-fallback";
import { DEMO_JOBS } from "@/lib/demo-data";
import type { JobCreateInput } from "@/types/job";

export const jobsKeys = {
  all: ["jobs"] as const,
  detail: (id: number) => ["jobs", id] as const,
};

export function useJobs() {
  return useQuery({
    queryKey: jobsKeys.all,
    queryFn: ({ signal }) => withDemoFallback(() => jobsApi.list(signal), DEMO_JOBS),
  });
}

export function useJob(jobId: number | undefined) {
  return useQuery({
    queryKey: jobsKeys.detail(jobId ?? -1),
    queryFn: ({ signal }) =>
      withDemoFallback(
        () => jobsApi.get(jobId as number, signal),
        DEMO_JOBS.find((j) => j.id === jobId) ?? DEMO_JOBS[0]!,
      ),
    enabled: jobId !== undefined,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: JobCreateInput) => jobsApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobsKeys.all });
    },
  });
}
