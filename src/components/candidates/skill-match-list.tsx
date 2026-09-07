import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export function SkillMatchList({ items }: { items: { skill: string; matched: boolean }[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">This job has no required skills listed yet.</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.skill} className="flex items-center gap-2 text-sm">
          <span
            className={cn(
              "flex size-4 shrink-0 items-center justify-center rounded-full",
              item.matched ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-muted text-muted-foreground",
            )}
          >
            {item.matched ? <Check className="size-2.5" /> : <Minus className="size-2.5" />}
          </span>
          <span className={item.matched ? "text-foreground" : "text-muted-foreground"}>{item.skill}</span>
          <span className="ml-auto text-xs text-muted-foreground">
            {item.matched ? "Detected in profile" : "Not confirmed"}
          </span>
        </li>
      ))}
    </ul>
  );
}
