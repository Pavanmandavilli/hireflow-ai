"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * The backend's CallRequest accepts `timezone` and `max_retry_count` per call,
 * but has no endpoint to store organization-wide defaults — so we keep the
 * recruiter's preferred defaults client-side and apply them when starting outreach.
 * Calling hours are informational only (not enforced by the backend today).
 */
export interface CallingSettings {
  timezone: string;
  callingHoursStart: string;
  callingHoursEnd: string;
  maxRetries: number;
}

const STORAGE_KEY = "hireflow:calling-settings";

const DEFAULTS: CallingSettings = {
  timezone: "Asia/Kolkata",
  callingHoursStart: "09:00",
  callingHoursEnd: "18:00",
  maxRetries: 2,
};

const listeners = new Set<() => void>();
let cache: CallingSettings | null = null;

function read(): CallingSettings {
  if (typeof window === "undefined") return DEFAULTS;
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    cache = raw ? { ...DEFAULTS, ...(JSON.parse(raw) as Partial<CallingSettings>) } : DEFAULTS;
  } catch {
    cache = DEFAULTS;
  }
  return cache;
}

function write(next: CallingSettings) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage unavailable — settings still apply for this session via cache
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getServerSnapshot(): CallingSettings {
  return DEFAULTS;
}

export function useCallingSettings() {
  const settings = useSyncExternalStore(subscribe, read, getServerSnapshot);

  const update = useCallback((patch: Partial<CallingSettings>) => {
    write({ ...read(), ...patch });
  }, []);

  return { settings, update };
}
