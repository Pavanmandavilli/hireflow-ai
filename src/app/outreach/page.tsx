import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { OutreachContent } from "@/components/outreach/outreach-content";

export default function OutreachPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 rounded-lg" />}>
      <OutreachContent />
    </Suspense>
  );
}
