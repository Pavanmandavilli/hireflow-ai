import { humanizeKey, humanizeValue } from "@/lib/format";
import type { CallResult } from "@/types/call";

const SUMMARY_KEYS = ["summary", "conversation_summary", "call_summary"];

/** Renders every field in the Hunar result payload dynamically — the schema isn't fixed. */
export function CallResultGrid({ result, excludeKeys = [] }: { result: CallResult; excludeKeys?: string[] }) {
  const entries = Object.entries(result).filter(
    ([key]) => !SUMMARY_KEYS.includes(key) && !excludeKeys.includes(key),
  );

  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">No structured screening results were returned.</p>;
  }

  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
      {entries.map(([key, value]) => (
        <div key={key} className="space-y-0.5">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{humanizeKey(key)}</dt>
          <dd className="text-sm font-medium text-foreground">{humanizeValue(value)}</dd>
        </div>
      ))}
    </dl>
  );
}
