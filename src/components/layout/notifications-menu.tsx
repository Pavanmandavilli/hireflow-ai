"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NOTIFICATIONS = [
  {
    title: "AI screening completed",
    detail: "Priya Nair was qualified for Senior Python Engineer.",
    time: "20m ago",
  },
  {
    title: "Candidate search completed",
    detail: "5 candidates found for Senior Python Engineer.",
    time: "1h ago",
  },
  {
    title: "AI outreach started",
    detail: "5 candidates queued for calling.",
    time: "3h ago",
  },
];

export function NotificationsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell className="size-4.5" />
          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-indigo-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Recent activity</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {NOTIFICATIONS.map((n) => (
          <div key={n.title + n.time} className="flex flex-col gap-0.5 px-2 py-1.5 text-sm">
            <span className="font-medium text-foreground">{n.title}</span>
            <span className="text-xs text-muted-foreground">{n.detail}</span>
            <span className="text-[11px] text-muted-foreground/70">{n.time}</span>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
