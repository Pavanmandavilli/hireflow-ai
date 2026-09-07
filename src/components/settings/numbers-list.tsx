import { Phone } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import type { HunarPhoneNumber } from "@/types/hunar";

export function NumbersList({ numbers }: { numbers: HunarPhoneNumber[] }) {
  if (numbers.length === 0) {
    return (
      <EmptyState
        icon={Phone}
        title="No phone numbers configured"
        description="Add a calling number in Hunar.AI to see it here."
      />
    );
  }

  return (
    <ul className="divide-y divide-border rounded-lg border border-border">
      {numbers.map((number) => (
        <li key={number.id} className="flex items-center gap-3 px-4 py-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-accent">
            <Phone className="size-4 text-accent-foreground" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{number.phone_number}</p>
            {number.label && <p className="truncate text-xs text-muted-foreground">{number.label}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}
