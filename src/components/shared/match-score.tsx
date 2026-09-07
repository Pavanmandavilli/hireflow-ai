import { cn } from "@/lib/utils";
import { matchLabel, toMatchPercent } from "@/lib/format";

function scoreColorClass(pct: number): string {
  if (pct >= 90) return "bg-emerald-500";
  if (pct >= 75) return "bg-indigo-500";
  if (pct >= 60) return "bg-amber-500";
  return "bg-muted-foreground/60";
}

function scoreTextClass(pct: number): string {
  if (pct >= 90) return "text-emerald-700 dark:text-emerald-400";
  if (pct >= 75) return "text-indigo-700 dark:text-indigo-400";
  if (pct >= 60) return "text-amber-700 dark:text-amber-400";
  return "text-muted-foreground";
}

/** Compact version for table rows: percentage + label + slim bar. */
export function MatchScoreCell({ score }: { score: number | null }) {
  const pct = toMatchPercent(score);
  if (pct === null) {
    return <span className="text-sm text-muted-foreground">Not scored</span>;
  }
  return (
    <div className="flex flex-col gap-1 min-w-28">
      <div className="flex items-baseline gap-1.5">
        <span className={cn("text-sm font-semibold tabular-nums", scoreTextClass(pct))}>{pct}%</span>
        <span className="text-xs text-muted-foreground">{matchLabel(pct)}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div className={cn("h-full rounded-full", scoreColorClass(pct))} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/** Prominent version for the candidate profile header / match analysis panel. */
export function MatchScoreLarge({ score }: { score: number | null }) {
  const pct = toMatchPercent(score);
  if (pct === null) {
    return <span className="text-lg text-muted-foreground">Not scored</span>;
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <span className={cn("text-4xl font-semibold tabular-nums", scoreTextClass(pct))}>{pct}%</span>
        <span className="text-sm font-medium text-muted-foreground">{matchLabel(pct)}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div className={cn("h-full rounded-full", scoreColorClass(pct))} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/** Single skill row inside the Match Analysis breakdown. */
export function SkillMatchRow({ label, score }: { label: string; score: number }) {
  const pct = toMatchPercent(score) ?? 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-sm text-foreground">{label}</span>
      <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
        <div className={cn("h-full rounded-full", scoreColorClass(pct))} style={{ width: `${pct}%` }} />
      </div>
      <span className={cn("w-10 shrink-0 text-right text-sm font-medium tabular-nums", scoreTextClass(pct))}>
        {pct}%
      </span>
    </div>
  );
}
