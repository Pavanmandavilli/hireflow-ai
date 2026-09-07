"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { callsApi } from "@/lib/api/calls";
import { withDemoFallback, type FallbackResult } from "@/lib/api/with-fallback";
import { DEMO_CALLS } from "@/lib/demo-data";
import { ACTIVE_CALL_STATUSES, type BulkCallCreateInput, type Call, type CallCreateInput } from "@/types/call";

export const callsKeys = {
  all: ["calls"] as const,
  list: (jobId?: number) => ["calls", { jobId: jobId ?? "all" }] as const,
  detail: (id: number) => ["calls", "detail", id] as const,
};

const POLL_INTERVAL_MS = 7000;

function hasActiveCall(calls: Call[]): boolean {
  return calls.some((c) => ACTIVE_CALL_STATUSES.includes(c.status));
}

export function useCalls(jobId?: number) {
  return useQuery({
    queryKey: callsKeys.list(jobId),
    queryFn: ({ signal }) =>
      withDemoFallback(
        () => callsApi.list(jobId, signal),
        jobId ? DEMO_CALLS.filter((c) => c.job_id === jobId) : DEMO_CALLS,
      ),
    refetchInterval: (query) => {
      const result = query.state.data as FallbackResult<Call[]> | undefined;
      return result && hasActiveCall(result.data) ? POLL_INTERVAL_MS : false;
    },
  });
}

export function useCall(callId: number | undefined) {
  return useQuery({
    queryKey: callsKeys.detail(callId ?? -1),
    queryFn: ({ signal }) =>
      withDemoFallback(
        () => callsApi.get(callId as number, signal),
        DEMO_CALLS.find((c) => c.id === callId) ?? DEMO_CALLS[0]!,
      ),
    enabled: callId !== undefined,
    refetchInterval: (query) => {
      const result = query.state.data as FallbackResult<Call> | undefined;
      return result && ACTIVE_CALL_STATUSES.includes(result.data.status) ? POLL_INTERVAL_MS : false;
    },
  });
}

/** Never falls back to demo data — starting a real call is a real-world action. */
export function useCreateCall() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CallCreateInput) => callsApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: callsKeys.all });
    },
  });
}

/** Never falls back to demo data — starting real calls is a real-world action. */
export function useCreateBulkCalls() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: BulkCallCreateInput) => callsApi.createBulk(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: callsKeys.all });
    },
  });
}
