export type JobStatus = "OPEN" | "PAUSED" | "CLOSED";

/** Matches FastAPI `JobResponse` (app/schemas/hiring_schema.py). */
export interface Job {
  id: number;
  title: string;
  description: string;
  location: string | null;
  skills: string[];
  experience_min: number | null;
  experience_max: number | null;
  status: string;
  created_at: string;
}

/** Matches FastAPI `JobCreate`. */
export interface JobCreateInput {
  title: string;
  description: string;
  location?: string;
  skills: string[];
  experience_min?: number;
  experience_max?: number;
}

/**
 * Client-derived preview shown while drafting a job, before the job is created.
 * Not persisted by the backend — purely to give the recruiter an immediate
 * sense of how the JD will be parsed once AI analysis runs server-side.
 */
export interface JobAnalysisPreview {
  requiredSkills: string[];
  experienceLabel: string;
  screeningAreas: string[];
  suggestedQuestions: string[];
}
