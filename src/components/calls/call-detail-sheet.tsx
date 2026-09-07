import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { CandidateAvatar } from "@/components/shared/candidate-avatar";
import { CallStatusBadge } from "./call-status-badge";
import { CallTimeline } from "./call-timeline";
import { CallResultGrid } from "./call-result-grid";
import { callConversationSummary } from "@/lib/call-result";
import { formatDateTime, formatDuration } from "@/lib/format";
import type { Call } from "@/types/call";
import type { Candidate } from "@/types/candidate";

export function CallDetailSheet({
  call,
  candidate,
  open,
  onOpenChange,
}: {
  call: Call | null;
  candidate: Candidate | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!call) return null;
  const summary = callConversationSummary(call.result);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            <CandidateAvatar name={candidate?.name ?? `Candidate #${call.candidate_id}`} />
            {candidate?.name ?? `Candidate #${call.candidate_id}`}
          </SheetTitle>
          <SheetDescription asChild>
            <span className="flex items-center gap-2">
              <CallStatusBadge status={call.status} />
              <span className="text-xs text-muted-foreground">{formatDuration(call.duration_seconds)}</span>
            </span>
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto px-4 pb-6">
          <section className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Timeline</h3>
            <CallTimeline status={call.status} />
          </section>

          <Separator />

          <section className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Conversation Summary</h3>
            <p className="text-sm text-muted-foreground">
              {summary ?? "No conversation summary available for this call yet."}
            </p>
          </section>

          <Separator />

          <section className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Screening Results</h3>
            {call.result ? (
              <CallResultGrid result={call.result} />
            ) : (
              <p className="text-sm text-muted-foreground">
                {call.status === "COMPLETED"
                  ? "No structured screening results were returned."
                  : "Results will appear once the call completes."}
              </p>
            )}
          </section>

          {call.recording_url && (
            <>
              <Separator />
              <section className="space-y-2">
                <h3 className="text-sm font-medium text-foreground">Recording</h3>
                <audio controls src={call.recording_url} className="w-full" />
              </section>
            </>
          )}

          <Separator />

          <section className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Call Metadata</h3>
            <dl className="grid grid-cols-2 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Agent</dt>
              <dd className="text-right text-foreground">{call.agent_id}</dd>
              <dt className="text-muted-foreground">Hunar Call ID</dt>
              <dd className="truncate text-right text-foreground">{call.hunar_call_id ?? "—"}</dd>
              <dt className="text-muted-foreground">Started</dt>
              <dd className="text-right text-foreground">{formatDateTime(call.created_at)}</dd>
              <dt className="text-muted-foreground">Updated</dt>
              <dd className="text-right text-foreground">{formatDateTime(call.updated_at)}</dd>
            </dl>
          </section>

          <Link
            href={`/calls/${call.id}`}
            className="flex items-center justify-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            View full call report
            <ExternalLink className="size-3.5" />
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
