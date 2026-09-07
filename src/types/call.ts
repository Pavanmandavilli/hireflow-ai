/** Common `status` values the backend/Hunar are known to use. Treat as open-ended. */
export type CallStatus =
  | "QUEUED"
  | "CALLING"
  | "CONNECTED"
  | "COMPLETED"
  | "NOT_CONNECTED"
  | "FAILED"
  | "CANCELLED"
  | (string & {});

/** Statuses that mean the call is still in flight and worth polling. */
export const ACTIVE_CALL_STATUSES: readonly CallStatus[] = [
  "QUEUED",
  "CALLING",
  "CONNECTED",
];

/**
 * The result payload returned by Hunar's screening call, proxied verbatim
 * through the backend as `result: dict[str, Any]`. Shape is not fixed by the
 * backend — render it dynamically rather than assuming these exact keys.
 */
export type CallResult = Record<string, unknown>;

/** Matches FastAPI `CallResponse`. */
export interface Call {
  id: number;
  candidate_id: number;
  job_id: number | null;
  hunar_call_id: string | null;
  agent_id: string;
  request_id: string | null;
  status: CallStatus;
  lifecycle_status: string | null;
  duration_seconds: number | null;
  recording_url: string | null;
  result: CallResult | null;
  created_at: string;
  updated_at: string | null;
}

/** Matches FastAPI `CallRequest`. */
export interface CallCreateInput {
  candidate_id: number;
  agent_id: string;
  from_phone_number?: string;
  timezone?: string;
  max_retry_count?: number;
  custom_data?: Record<string, unknown>;
}

/** Matches FastAPI `BulkCallRequest`. */
export interface BulkCallCreateInput {
  candidate_ids: number[];
  agent_id: string;
  from_phone_number?: string;
  timezone?: string;
  max_retry_count?: number;
}
