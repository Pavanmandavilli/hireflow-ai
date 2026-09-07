import { PhoneOutgoing, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SelectionBar({
  count,
  onStartOutreach,
  onClear,
}: {
  count: number;
  onStartOutreach: () => void;
  onClear: () => void;
}) {
  if (count === 0) return null;

  return (
    <div className="sticky bottom-4 z-10 mx-auto flex w-full max-w-lg items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3 shadow-md">
      <span className="text-sm font-medium text-foreground">
        {count} candidate{count === 1 ? "" : "s"} selected
      </span>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X />
          Clear Selection
        </Button>
        <Button size="sm" onClick={onStartOutreach}>
          <PhoneOutgoing />
          Start AI Outreach
        </Button>
      </div>
    </div>
  );
}
