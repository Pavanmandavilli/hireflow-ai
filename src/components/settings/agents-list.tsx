import { Bot } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import type { HunarAgent } from "@/types/hunar";

export function AgentsList({ agents }: { agents: HunarAgent[] }) {
  if (agents.length === 0) {
    return (
      <EmptyState
        icon={Bot}
        title="No AI agents configured"
        description="Configure a voice agent in Hunar.AI to see it here."
      />
    );
  }

  return (
    <ul className="divide-y divide-border rounded-lg border border-border">
      {agents.map((agent) => (
        <li key={agent.id} className="flex items-center gap-3 px-4 py-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-accent">
            <Bot className="size-4 text-accent-foreground" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{agent.name}</p>
            {typeof agent.description === "string" && agent.description && (
              <p className="truncate text-xs text-muted-foreground">{agent.description}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
