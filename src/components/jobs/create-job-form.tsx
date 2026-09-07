"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SkillsInput } from "./skills-input";
import { JobAnalysisPreviewCard } from "./job-analysis-preview";
import { useCreateJob } from "@/hooks/use-jobs";
import { analyzeJobDescription } from "@/lib/job-analysis";
import { ApiError } from "@/lib/api/client";

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

interface FormErrors {
  title?: string;
  description?: string;
}

export function CreateJobForm() {
  const router = useRouter();
  const createJob = useCreateJob();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [experienceMin, setExperienceMin] = useState("");
  const [experienceMax, setExperienceMax] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const parsedMin = experienceMin ? Number(experienceMin) : undefined;
  const parsedMax = experienceMax ? Number(experienceMax) : undefined;

  const analysis = useMemo(
    () => analyzeJobDescription(description, skills, parsedMin, parsedMax),
    [description, skills, parsedMin, parsedMax],
  );

  function validate(): boolean {
    const next: FormErrors = {};
    if (title.trim().length < 2) next.title = "Title must be at least 2 characters.";
    if (description.trim().length < 20) next.description = "Description must be at least 20 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    try {
      const job = await createJob.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        location: location.trim() || undefined,
        skills: skills.length > 0 ? skills : analysis.requiredSkills,
        experience_min: parsedMin,
        experience_max: parsedMax,
      });
      toast.success("Job created successfully.");
      router.push(`/jobs/${job.id}`);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Unable to create the job. Please try again.";
      toast.error(message);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="job-title">Job Title</Label>
            <Input
              id="job-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Python Engineer"
              aria-invalid={!!errors.title}
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="job-location">Location</Label>
            <Input
              id="job-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Bengaluru"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="job-employment-type">Employment Type</Label>
            <Select value={employmentType} onValueChange={setEmploymentType}>
              <SelectTrigger id="job-employment-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EMPLOYMENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="job-experience-min">Experience — Min (years)</Label>
            <Input
              id="job-experience-min"
              type="number"
              min={0}
              value={experienceMin}
              onChange={(e) => setExperienceMin(e.target.value)}
              placeholder="4"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="job-experience-max">Experience — Max (years)</Label>
            <Input
              id="job-experience-max"
              type="number"
              min={0}
              value={experienceMax}
              onChange={(e) => setExperienceMax(e.target.value)}
              placeholder="8"
            />
          </div>
        </div>

        <SkillsInput skills={skills} onChange={setSkills} />

        <div className="space-y-2">
          <Label htmlFor="job-description">Job Description</Label>
          <Textarea
            id="job-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Paste the complete job description here..."
            className="min-h-64"
            aria-invalid={!!errors.description}
          />
          {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
        </div>

        <Button type="submit" disabled={createJob.isPending} className="w-full sm:w-auto">
          {createJob.isPending ? (
            <>
              <Loader2 className="animate-spin" />
              Creating job...
            </>
          ) : (
            "Create Job"
          )}
        </Button>
      </form>

      <JobAnalysisPreviewCard analysis={analysis} />
    </div>
  );
}
