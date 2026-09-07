import { ApiError } from "./client";

export interface FallbackResult<T> {
  data: T;
  /** True when the backend was unreachable and demo data is shown instead. */
  isDemo: boolean;
}

/**
 * Used only for read-only lookups (job/candidate/call listings, Hunar agent
 * and number directories). Falls back to bundled demo data ONLY when the
 * backend can't be reached at all (see ApiError.isNetworkError) — a real
 * error from a reachable backend (4xx/5xx) is never masked, and write
 * actions (create job, start a call) never use this: see section 21 of the
 * product spec — never fake a successful real-world action.
 */
export async function withDemoFallback<T>(
  fetcher: () => Promise<T>,
  demoData: T,
): Promise<FallbackResult<T>> {
  try {
    const data = await fetcher();
    return { data, isDemo: false };
  } catch (err) {
    if (err instanceof ApiError && err.isNetworkError) {
      return { data: demoData, isDemo: true };
    }
    throw err;
  }
}
