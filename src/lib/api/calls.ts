import { apiClient } from "./client";
import type { BulkCallCreateInput, Call, CallCreateInput } from "@/types/call";

export const callsApi = {
  list: (jobId?: number, signal?: AbortSignal) =>
    apiClient.get<Call[]>("/calls", { job_id: jobId }, signal),
  get: (callId: number, signal?: AbortSignal) =>
    apiClient.get<Call>(`/calls/${callId}`, undefined, signal),
  create: (input: CallCreateInput) => apiClient.post<Call>("/calls", input),
  createBulk: (input: BulkCallCreateInput) => apiClient.post<Call[]>("/calls/bulk", input),
};
