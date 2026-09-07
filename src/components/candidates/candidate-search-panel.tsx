"use client";

import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export function CandidateSearchPanel({
  defaultLocation,
  isSearching,
  onSearch,
}: {
  defaultLocation: string;
  isSearching: boolean;
  onSearch: (input: { location: string; limit: number }) => void;
}) {
  const [location, setLocation] = useState(defaultLocation);
  const [limit, setLimit] = useState(10);

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <Label htmlFor="search-location">Location</Label>
          <Input
            id="search-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Bengaluru"
          />
        </div>
        <div className="w-full space-y-2 sm:w-40">
          <Label htmlFor="search-limit">Candidate count</Label>
          <Input
            id="search-limit"
            type="number"
            min={1}
            max={50}
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          />
        </div>
        <Button
          onClick={() => onSearch({ location, limit })}
          disabled={isSearching}
          className="w-full sm:w-auto"
        >
          {isSearching ? (
            <>
              <Loader2 className="animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search />
              Find Candidates
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
