import { apiClient } from "./client";
import type { Candidate, CandidateSearchInput } from "@/types/candidate";

export const candidatesApi = {
  list: (jobId?: number, signal?: AbortSignal) =>
    apiClient.get<Candidate[]>("/candidates", { job_id: jobId }, signal),
  search: (input: CandidateSearchInput) =>
    apiClient.post<Candidate[]>("/candidates/search", input),
};
