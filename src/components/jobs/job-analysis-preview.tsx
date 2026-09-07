import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { JobAnalysisPreview } from "@/types/job";

export function JobAnalysisPreviewCard({ analysis }: { analysis: JobAnalysisPreview }) {
  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          AI Job Analysis
        </CardTitle>
        <CardDescription>Derived automatically as you write the job description.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <section className="space-y-2">
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Required Skills</h3>
          {analysis.requiredSkills.length === 0 ? (
            <p className="text-sm text-muted-foreground">Add skills or paste a description to detect them.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {analysis.requiredSkills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </section>

        <Separator />

        <section className="space-y-2">
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Experience</h3>
          <p className="text-sm text-foreground">{analysis.experienceLabel}</p>
        </section>

        <Separator />

        <section className="space-y-2">
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Suggested Screening Areas
          </h3>
          <ul className="space-y-1.5">
            {analysis.screeningAreas.map((area) => (
              <li key={area} className="flex items-center gap-2 text-sm text-foreground">
                <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                {area}
              </li>
            ))}
          </ul>
        </section>

        <Separator />

        <section className="space-y-2">
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Suggested Questions</h3>
          <ol className="space-y-2 text-sm text-foreground">
            {analysis.suggestedQuestions.map((q, i) => (
              <li key={i} className="flex gap-2">
                <span className="shrink-0 font-medium text-muted-foreground">{i + 1}.</span>
                {q}
              </li>
            ))}
          </ol>
        </section>
      </CardContent>
    </Card>
  );
}
