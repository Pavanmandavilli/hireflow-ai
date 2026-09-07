import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

export function CandidateAvatar({ name, className }: { name: string; className?: string }) {
  return (
    <Avatar className={cn("size-9", className)}>
      <AvatarFallback className="bg-indigo-50 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
