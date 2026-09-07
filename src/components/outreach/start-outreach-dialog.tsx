"use client";

import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function StartOutreachDialog({
  open,
  onOpenChange,
  agentName,
  numberLabel,
  candidateNames,
  isSubmitting,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentName: string;
  numberLabel: string;
  candidateNames: string[];
  isSubmitting: boolean;
  onConfirm: () => void;
}) {
  const count = candidateNames.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start AI outreach?</DialogTitle>
          <DialogDescription>
            {count} candidate{count === 1 ? "" : "s"} will receive an AI-powered screening call.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Agent</span>
            <span className="font-medium text-foreground">{agentName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Calling Number</span>
            <span className="font-medium text-foreground">{numberLabel}</span>
          </div>
          <Separator />
          <div>
            <p className="mb-1.5 text-muted-foreground">Candidates</p>
            <ul className="max-h-32 space-y-1 overflow-y-auto">
              {candidateNames.map((name) => (
                <li key={name} className="text-foreground">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Starting AI call...
              </>
            ) : (
              "Start Outreach"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
