import { apiClient } from "./client";
import type { Job, JobCreateInput } from "@/types/job";

export const jobsApi = {
  list: (signal?: AbortSignal) => apiClient.get<Job[]>("/jobs", undefined, signal),
  get: (jobId: number, signal?: AbortSignal) => apiClient.get<Job>(`/jobs/${jobId}`, undefined, signal),
  create: (input: JobCreateInput) => apiClient.post<Job>("/jobs", input),
};
