import { Check, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CallStatus } from "@/types/call";

type StepState = "done" | "active" | "pending" | "failed";

function stepsForStatus(status: CallStatus): { label: string; state: StepState }[] {
  const steps = ["Call initiated", "Candidate answered", "AI screening started", "Screening completed", "Call ended"];

  switch (status) {
    case "QUEUED":
      return steps.map((label, i) => ({ label, state: i === 0 ? "active" : "pending" }));
    case "CALLING":
      return steps.map((label, i) => ({ label, state: i === 0 ? "done" : i === 1 ? "active" : "pending" }));
    case "CONNECTED":
      return steps.map((label, i) => ({ label, state: i <= 1 ? "done" : i === 2 ? "active" : "pending" }));
    case "COMPLETED":
      return steps.map((label) => ({ label, state: "done" }));
    case "NOT_CONNECTED":
      return steps.map((label, i) => ({ label, state: i === 0 ? "done" : i === 1 ? "failed" : "pending" }));
    case "FAILED":
      return steps.map((label, i) => ({ label, state: i === 0 ? "done" : i === 1 ? "failed" : "pending" }));
    case "CANCELLED":
      return steps.map((label, i) => ({ label, state: i === 0 ? "done" : "pending" }));
    default:
      return steps.map((label) => ({ label, state: "pending" }));
  }
}

export function CallTimeline({ status }: { status: CallStatus }) {
  const steps = stepsForStatus(status);

  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li key={step.label} className="flex items-center gap-3">
          <span
            className={cn(
              "flex size-5 shrink-0 items-center justify-center rounded-full",
              step.state === "done" && "bg-emerald-500 text-white",
              step.state === "active" && "bg-indigo-500 text-white",
              step.state === "failed" && "bg-rose-500 text-white",
              step.state === "pending" && "bg-muted text-muted-foreground",
            )}
          >
            {step.state === "done" && <Check className="size-3" />}
            {step.state === "active" && <Loader2 className="size-3 animate-spin" />}
            {step.state === "failed" && <X className="size-3" />}
            {step.state === "pending" && <span className="size-1.5 rounded-full bg-current" />}
          </span>
          <span
            className={cn(
              "text-sm",
              step.state === "pending" ? "text-muted-foreground" : "text-foreground",
              step.state === "failed" && "text-rose-600 dark:text-rose-400",
            )}
          >
            {step.label}
          </span>
          {i < steps.length - 1 && <span className="sr-only">, </span>}
        </li>
      ))}
    </ol>
  );
}
