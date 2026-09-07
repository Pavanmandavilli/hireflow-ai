/**
 * Thin, typed fetch wrapper around the FastAPI backend.
 *
 * The frontend NEVER talks to Hunar.AI directly — every request here goes to
 * our own FastAPI service, which itself proxies to Hunar. No Hunar API key
 * or Hunar base URL exists anywhere in this codebase.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/** Matches the FastAPI service prefix + router mount from app/main.py + app/api/router.py. */
const HIRING_BASE = `${API_BASE}/hiring-assistant/api/v1/hiring`;

export class ApiError extends Error {
  readonly status: number;
  /** True when the request never reached the server (network/DNS/CORS failure). */
  readonly isNetworkError: boolean;

  constructor(message: string, status: number, isNetworkError = false) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.isNetworkError = isNetworkError;
  }
}

function friendlyMessage(status: number, body: unknown): string {
  const detail =
    typeof body === "object" && body !== null && "detail" in body
      ? (body as { detail: unknown }).detail
      : undefined;
  const detailText =
    typeof detail === "string"
      ? detail
      : Array.isArray(detail)
        ? detail
            .map((d) =>
              typeof d === "object" && d !== null && "msg" in d
                ? String((d as { msg: unknown }).msg)
                : String(d),
            )
            .join(", ")
        : undefined;

  switch (status) {
    case 400:
      return detailText ?? "That request wasn't valid. Please check the details and try again.";
    case 401:
      return "You're not authorized to do that. Please sign in again.";
    case 404:
      return detailText ?? "We couldn't find that record.";
    case 422:
      return detailText ?? "Some fields need attention before this can be submitted.";
    case 500:
      return "Something went wrong on our end. Please try again in a moment.";
    case 502:
      return detailText ?? "The voice calling provider is unavailable right now. Please try again shortly.";
    default:
      return detailText ?? `Request failed (${status}). Please try again.`;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  searchParams?: Record<string, string | number | undefined>;
  signal?: AbortSignal;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = new URL(`${HIRING_BASE}${path}`);
  if (options.searchParams) {
    for (const [key, value] of Object.entries(options.searchParams)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      method: options.method ?? "GET",
      headers: options.body ? { "Content-Type": "application/json" } : undefined,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: options.signal,
      cache: "no-store",
    });
  } catch {
    throw new ApiError(
      "Can't reach the backend. Check that the FastAPI service is running and NEXT_PUBLIC_API_URL is correct.",
      0,
      true,
    );
  }

  if (!response.ok) {
    let body: unknown = undefined;
    try {
      body = await response.json();
    } catch {
      // no JSON body
    }
    throw new ApiError(friendlyMessage(response.status, body), response.status);
  }

  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export const apiClient = {
  get: <T>(path: string, searchParams?: RequestOptions["searchParams"], signal?: AbortSignal) =>
    request<T>(path, { method: "GET", searchParams, signal }),
  post: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    request<T>(path, { method: "POST", body, signal }),
};

export { API_BASE };
