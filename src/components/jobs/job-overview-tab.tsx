import { useMemo } from "react";
import { MapPin, CalendarClock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatExperienceRange } from "@/lib/format";
import { analyzeJobDescription } from "@/lib/job-analysis";
import type { Job } from "@/types/job";

export function JobOverviewTab({ job }: { job: Job }) {
  const analysis = useMemo(
    () => analyzeJobDescription(job.description, job.skills, job.experience_min ?? undefined, job.experience_max ?? undefined),
    [job.description, job.skills, job.experience_min, job.experience_max],
  );

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">{job.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Screening Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-sm text-foreground">
              {analysis.suggestedQuestions.map((q, i) => (
                <li key={i} className="flex gap-2">
                  <span className="shrink-0 font-medium text-muted-foreground">{i + 1}.</span>
                  {q}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-foreground">
              <MapPin className="size-4 text-muted-foreground" />
              {job.location ?? "Remote"}
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <CalendarClock className="size-4 text-muted-foreground" />
              {formatExperienceRange(job.experience_min, job.experience_max)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Required Skills</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-1.5">
            {(job.skills.length > 0 ? job.skills : analysis.requiredSkills).map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hiring Criteria</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5 text-sm">
              {analysis.screeningAreas.map((area) => (
                <li key={area} className="flex items-center gap-2 text-foreground">
                  <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                  {area}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
