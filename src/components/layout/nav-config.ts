import {
  LayoutDashboard,
  Briefcase,
  Users,
  PhoneOutgoing,
  PhoneCall,
  BarChart3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Jobs", href: "/jobs", icon: Briefcase },
  { title: "Candidates", href: "/candidates", icon: Users },
  { title: "AI Outreach", href: "/outreach", icon: PhoneOutgoing },
  { title: "Calls", href: "/calls", icon: PhoneCall },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
];

export function pageTitleForPath(pathname: string): string {
  if (pathname.startsWith("/jobs/new")) return "Create Job";
  if (/^\/jobs\/[^/]+\/candidates/.test(pathname)) return "Find Candidates";
  if (/^\/jobs\/[^/]+/.test(pathname)) return "Job Details";
  if (pathname.startsWith("/candidates/")) return "Candidate Profile";
  if (pathname.startsWith("/calls/")) return "Call Detail";
  if (pathname.startsWith("/settings")) return "Settings";
  const match = NAV_ITEMS.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
  return match?.title ?? "HireFlow AI";
}
