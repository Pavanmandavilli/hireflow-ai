/**
 * The backend proxies these two endpoints straight through to Hunar.AI
 * (`HunarService.list_agents` / `list_numbers`), so the exact response shape
 * is whatever Hunar returns rather than something the backend fixes. The
 * fields below are the ones the UI depends on; `normalize*` in
 * lib/api/hunar.ts tolerates common variations (snake_case/camelCase,
 * top-level array vs `{ results: [...] }` / `{ data: [...] }`).
 */
export interface HunarAgent {
  id: string;
  name: string;
  description?: string | null;
  [key: string]: unknown;
}

export interface HunarPhoneNumber {
  id: string;
  phone_number: string;
  label?: string | null;
  [key: string]: unknown;
}
