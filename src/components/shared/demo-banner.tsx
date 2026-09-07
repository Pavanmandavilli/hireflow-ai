import { WifiOff } from "lucide-react";

/** Shown whenever a read screen is displaying bundled demo data because the FastAPI backend was unreachable. */
export function DemoBanner({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300 ${className ?? ""}`}
    >
      <WifiOff className="size-3.5 shrink-0" />
      <span>
        Showing demo data — the backend at <code className="font-mono">NEXT_PUBLIC_API_URL</code> isn&apos;t
        reachable right now.
      </span>
    </div>
  );
}
