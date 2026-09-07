/** Matches FastAPI `CandidateResponse`. */
export interface Candidate {
  id: number;
  job_id: number | null;
  name: string;
  email: string | null;
  phone: string | null;
  title: string | null;
  location: string | null;
  source: string | null;
  profile_url: string | null;
  match_score: number | null;
}

/** Matches FastAPI `CandidateSearchRequest`. */
export interface CandidateSearchInput {
  job_id: number;
  query?: string;
  location?: string;
  limit?: number;
}

/**
 * Screening progression shown in the UI. The backend has no single "status"
 * field on a candidate — this is derived client-side from that candidate's
 * call history (see lib/derive-status.ts) plus the local shortlist store.
 */
export type ScreeningStatus =
  | "Not Contacted"
  | "Contacted"
  | "Screened"
  | "Qualified"
  | "Shortlisted"
  | "Hired"
  | "Rejected";
