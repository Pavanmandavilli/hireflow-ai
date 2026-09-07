"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { pageTitleForPath } from "./nav-config";
import { GlobalSearch } from "./global-search";
import { NotificationsMenu } from "./notifications-menu";
import { AccountMenu } from "./account-menu";

export function SiteHeader() {
  const pathname = usePathname();
  const title = pageTitleForPath(pathname);

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-5" />
      <h2 className="shrink-0 text-sm font-semibold text-foreground">{title}</h2>
      <div className="hidden flex-1 justify-center px-4 md:flex">
        <GlobalSearch />
      </div>
      <div className="ml-auto flex items-center gap-1">
        <NotificationsMenu />
        <AccountMenu />
      </div>
    </header>
  );
}
