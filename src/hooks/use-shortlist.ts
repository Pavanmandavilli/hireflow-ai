"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Shortlist/reject is a recruiter-only decision the backend has no endpoint
 * for persisting. We keep it client-side (localStorage) so the UI can show a
 * real shortlist workflow without pretending the server tracks it.
 */

const STORAGE_KEY = "hireflow:shortlist";
export type ShortlistDecision = "shortlisted" | "rejected" | "hired";
type ShortlistMap = Record<number, ShortlistDecision>;

const listeners = new Set<() => void>();
let cache: ShortlistMap | null = null;

function read(): ShortlistMap {
  if (typeof window === "undefined") return {};
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    cache = raw ? (JSON.parse(raw) as ShortlistMap) : {};
  } catch {
    cache = {};
  }
  return cache;
}

function write(map: ShortlistMap) {
  cache = map;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // storage unavailable — decision still applies for this session via cache
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return read();
}

const EMPTY_MAP: ShortlistMap = {};

function getServerSnapshot(): ShortlistMap {
  return EMPTY_MAP;
}

export function useShortlist() {
  const map = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setDecision = useCallback((candidateId: number, decision: ShortlistDecision | null) => {
    const next = { ...read() };
    if (decision === null) delete next[candidateId];
    else next[candidateId] = decision;
    write(next);
  }, []);

  const getDecision = useCallback((candidateId: number) => map[candidateId] ?? null, [map]);

  return { decisions: map, setDecision, getDecision };
}
