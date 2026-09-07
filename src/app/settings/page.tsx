"use client";

import { PageHeader } from "@/components/shared/page-header";
import { DemoBanner } from "@/components/shared/demo-banner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AgentsList } from "@/components/settings/agents-list";
import { NumbersList } from "@/components/settings/numbers-list";
import { CallingConfigForm } from "@/components/settings/calling-config-form";
import { useHunarAgents, useHunarNumbers } from "@/hooks/use-hunar";

export default function SettingsPage() {
  const agentsQuery = useHunarAgents();
  const numbersQuery = useHunarNumbers();
  const isDemo = agentsQuery.data?.isDemo || numbersQuery.data?.isDemo;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Settings" subtitle="Configure AI voice agents and calling defaults." />

      {isDemo && <DemoBanner />}

      <Card>
        <CardHeader>
          <CardTitle>AI Voice Configuration</CardTitle>
          <CardDescription>
            Agents and phone numbers are managed in Hunar.AI. Credentials are never exposed to the browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Agents</h3>
            {agentsQuery.isLoading ? (
              <Skeleton className="h-32 rounded-lg" />
            ) : (
              <AgentsList agents={agentsQuery.data?.data ?? []} />
            )}
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Phone Numbers</h3>
            {numbersQuery.isLoading ? (
              <Skeleton className="h-32 rounded-lg" />
            ) : (
              <NumbersList numbers={numbersQuery.data?.data ?? []} />
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Calling Configuration</CardTitle>
          <CardDescription>Defaults applied when starting new AI outreach campaigns.</CardDescription>
        </CardHeader>
        <CardContent>
          <CallingConfigForm />
        </CardContent>
      </Card>
    </div>
  );
}
