"use client";

import { Bookmark, ChevronDown, ThumbsDown, Trophy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ShortlistDecision } from "@/hooks/use-shortlist";

const LABELS: Record<ShortlistDecision, string> = {
  shortlisted: "Shortlisted",
  hired: "Hired",
  rejected: "Rejected",
};

export function ShortlistMenu({
  decision,
  onChange,
}: {
  decision: ShortlistDecision | null;
  onChange: (decision: ShortlistDecision | null) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={decision ? "default" : "outline"}>
          <Bookmark />
          {decision ? LABELS[decision] : "Shortlist"}
          <ChevronDown className="opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onChange("shortlisted")}>
          <Bookmark />
          Shortlist
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChange("hired")}>
          <Trophy />
          Mark as Hired
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChange("rejected")} variant="destructive">
          <ThumbsDown />
          Reject
        </DropdownMenuItem>
        {decision && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onChange(null)}>
              <X />
              Clear decision
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
