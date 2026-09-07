import type { JobAnalysisPreview } from "@/types/job";

/**
 * Client-side "AI Job Analysis" preview shown while drafting a job posting.
 * This is a lightweight keyword/heuristic pass over the pasted JD purely for
 * demo purposes — it gives the recruiter an immediate preview of how the
 * role will be parsed. It is NOT a claim that the backend has analyzed
 * anything yet; the real analysis happens once the job is created.
 */

const SKILL_KEYWORDS: { match: RegExp; label: string }[] = [
  { match: /\bpython\b/i, label: "Python" },
  { match: /\bfastapi\b/i, label: "FastAPI" },
  { match: /\bdjango\b/i, label: "Django" },
  { match: /\bflask\b/i, label: "Flask" },
  { match: /\bpostgres(ql)?\b/i, label: "PostgreSQL" },
  { match: /\bmysql\b/i, label: "MySQL" },
  { match: /\bmongo(db)?\b/i, label: "MongoDB" },
  { match: /\bredis\b/i, label: "Redis" },
  { match: /\brest(ful)?\s?apis?\b/i, label: "REST APIs" },
  { match: /\bgraphql\b/i, label: "GraphQL" },
  { match: /\bai\b|\bmachine learning\b|\bml\b|\bllm\b/i, label: "AI/ML" },
  { match: /\bnlp\b/i, label: "NLP" },
  { match: /\bdocker\b/i, label: "Docker" },
  { match: /\bkubernetes\b|\bk8s\b/i, label: "Kubernetes" },
  { match: /\baws\b/i, label: "AWS" },
  { match: /\bgcp\b|google cloud/i, label: "GCP" },
  { match: /\bazure\b/i, label: "Azure" },
  { match: /\bkafka\b/i, label: "Kafka" },
  { match: /\bmicroservices?\b/i, label: "Microservices" },
  { match: /\breact(\.js)?\b/i, label: "React" },
  { match: /\btypescript\b/i, label: "TypeScript" },
  { match: /\bnode(\.js)?\b/i, label: "Node.js" },
  { match: /\bjava\b(?!script)/i, label: "Java" },
  { match: /\bspring\b/i, label: "Spring" },
  { match: /\bgo(lang)?\b/i, label: "Go" },
  { match: /\bsql\b/i, label: "SQL" },
  { match: /\bci\/cd\b|\bcicd\b/i, label: "CI/CD" },
];

const SCREENING_AREA_RULES: { match: RegExp; label: string }[] = [
  { match: /\bbackend\b|\bapi\b|\bserver\b/i, label: "Backend Development" },
  { match: /\bapi design\b|\brest\b|\bgraphql\b/i, label: "API Design" },
  { match: /\bpostgres|\bmysql|\bdatabase|\bsql\b|\bmongo/i, label: "Database Experience" },
  { match: /\bai\b|\bml\b|\bllm\b|machine learning/i, label: "AI Experience" },
  { match: /\bfrontend\b|\breact\b|\bui\b/i, label: "Frontend Development" },
  { match: /\bcloud\b|\baws\b|\bgcp\b|\bazure\b/i, label: "Cloud Infrastructure" },
  { match: /\blead(ership)?\b|\bmentor/i, label: "Leadership & Mentoring" },
  { match: /\bmicroservices?\b|\bdistributed\b/i, label: "System Design" },
];

export function analyzeJobDescription(
  description: string,
  extraSkills: string[],
  experienceMin?: number,
  experienceMax?: number,
): JobAnalysisPreview {
  const text = description || "";

  const detectedSkills = SKILL_KEYWORDS.filter((s) => s.match.test(text)).map((s) => s.label);
  const requiredSkills = Array.from(new Set([...extraSkills.filter(Boolean), ...detectedSkills])).slice(0, 8);

  const screeningAreas = SCREENING_AREA_RULES.filter((r) => r.match.test(text)).map((r) => r.label);
  if (screeningAreas.length === 0) screeningAreas.push("Role-Specific Experience", "Communication Skills");

  const experienceLabel =
    experienceMin || experienceMax
      ? experienceMin && experienceMax
        ? `${experienceMin}-${experienceMax} years`
        : experienceMin
          ? `${experienceMin}+ years`
          : `Up to ${experienceMax} years`
      : "Not specified";

  const topSkills = requiredSkills.slice(0, 3);
  const suggestedQuestions = [
    topSkills[0]
      ? `Tell me about a production system you built using ${topSkills[0]}.`
      : "Tell me about a production system you're proud of building.",
    topSkills[1]
      ? `What experience do you have with ${topSkills[1]}?`
      : "What tools and frameworks do you use most in your day-to-day work?",
    requiredSkills.some((s) => s === "AI/ML" || s === "NLP")
      ? "Have you worked with AI/LLM systems in production?"
      : `How do you approach quality and testing in your projects?`,
  ];

  return { requiredSkills, experienceLabel, screeningAreas, suggestedQuestions };
}
