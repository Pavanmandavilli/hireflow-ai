"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallingSettings } from "@/hooks/use-calling-settings";

export function CallingConfigForm() {
  const { settings, update } = useCallingSettings();
  const [timezone, setTimezone] = useState(settings.timezone);
  const [start, setStart] = useState(settings.callingHoursStart);
  const [end, setEnd] = useState(settings.callingHoursEnd);
  const [maxRetries, setMaxRetries] = useState(settings.maxRetries);

  function handleSave() {
    update({ timezone, callingHoursStart: start, callingHoursEnd: end, maxRetries });
    toast.success("Calling configuration saved.");
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="settings-timezone">Timezone</Label>
          <Input id="settings-timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="settings-max-retries">Max Retries</Label>
          <Input
            id="settings-max-retries"
            type="number"
            min={1}
            max={10}
            value={maxRetries}
            onChange={(e) => setMaxRetries(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="settings-hours-start">Calling Hours — Start</Label>
          <Input id="settings-hours-start" type="time" value={start} onChange={(e) => setStart(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="settings-hours-end">Calling Hours — End</Label>
          <Input id="settings-hours-end" type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>
      </div>
      <Button onClick={handleSave}>
        <Save />
        Save Configuration
      </Button>
    </div>
  );
}
