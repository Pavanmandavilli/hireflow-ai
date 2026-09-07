import { apiClient } from "./client";
import type { HunarAgent, HunarPhoneNumber } from "@/types/hunar";

/**
 * `/hunar/agents` and `/hunar/numbers` proxy Hunar's API response verbatim,
 * so the top-level shape can be a bare array or a wrapped `{ results | data }`
 * envelope. Unwrap defensively rather than assuming one shape.
 */
function unwrapList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    if (Array.isArray(obj.results)) return obj.results;
    if (Array.isArray(obj.data)) return obj.data;
    if (Array.isArray(obj.agents)) return obj.agents;
    if (Array.isArray(obj.numbers)) return obj.numbers;
  }
  return [];
}

function normalizeAgent(raw: unknown, index: number): HunarAgent {
  const r = (raw ?? {}) as Record<string, unknown>;
  const id = String(r.id ?? r.agent_id ?? r.agentId ?? index);
  const name = String(r.name ?? r.agent_name ?? r.agentName ?? r.title ?? `Agent ${id}`);
  return { ...r, id, name };
}

function normalizeNumber(raw: unknown, index: number): HunarPhoneNumber {
  const r = (raw ?? {}) as Record<string, unknown>;
  const id = String(r.id ?? r.number_id ?? r.numberId ?? index);
  const phone_number = String(
    r.phone_number ?? r.phoneNumber ?? r.number ?? r.from_number ?? "",
  );
  const label = (r.label ?? r.name ?? r.nickname ?? null) as string | null;
  return { ...r, id, phone_number, label };
}

export const hunarApi = {
  listAgents: async (signal?: AbortSignal): Promise<HunarAgent[]> => {
    const payload = await apiClient.get<unknown>("/hunar/agents", undefined, signal);
    return unwrapList(payload).map(normalizeAgent);
  },
  listNumbers: async (signal?: AbortSignal): Promise<HunarPhoneNumber[]> => {
    const payload = await apiClient.get<unknown>("/hunar/numbers", undefined, signal);
    return unwrapList(payload).map(normalizeNumber);
  },
};
