"use client";

import { useQuery } from "@tanstack/react-query";
import { hunarApi } from "@/lib/api/hunar";
import { withDemoFallback } from "@/lib/api/with-fallback";
import { DEMO_HUNAR_AGENTS, DEMO_HUNAR_NUMBERS } from "@/lib/demo-data";

export const hunarKeys = {
  agents: ["hunar", "agents"] as const,
  numbers: ["hunar", "numbers"] as const,
};

export function useHunarAgents() {
  return useQuery({
    queryKey: hunarKeys.agents,
    queryFn: ({ signal }) => withDemoFallback(() => hunarApi.listAgents(signal), DEMO_HUNAR_AGENTS),
    staleTime: 5 * 60 * 1000,
  });
}

export function useHunarNumbers() {
  return useQuery({
    queryKey: hunarKeys.numbers,
    queryFn: ({ signal }) => withDemoFallback(() => hunarApi.listNumbers(signal), DEMO_HUNAR_NUMBERS),
    staleTime: 5 * 60 * 1000,
  });
}
