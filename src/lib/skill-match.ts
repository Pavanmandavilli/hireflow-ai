import type { Candidate } from "@/types/candidate";

/**
 * Mirrors the backend's own match heuristic (HiringService.search_candidates):
 * `text = f"{name} {title}".lower(); skill_hits = sum(1 for s in job.skills if s.lower() in text)`.
 * We reuse it here only to show *which* required skills are detectable in the
 * candidate's profile text — never to invent a fake per-skill percentage.
 */
export function matchedSkills(candidate: Candidate, jobSkills: string[]): { skill: string; matched: boolean }[] {
  const text = `${candidate.name} ${candidate.title ?? ""}`.toLowerCase();
  return jobSkills.map((skill) => ({ skill, matched: text.includes(skill.toLowerCase()) }));
}
