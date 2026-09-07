import type { Job } from "@/types/job";
import type { Candidate } from "@/types/candidate";
import type { Call } from "@/types/call";
import type { HunarAgent, HunarPhoneNumber } from "@/types/hunar";

/**
 * Realistic demo dataset shown only when the FastAPI backend is unreachable
 * (see lib/api/with-fallback.ts). Every read screen clearly marks this as
 * demo data in the UI — it is never used to fake the result of a write
 * action like creating a job or starting a call.
 */

const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * 3_600_000).toISOString();

export const DEMO_JOBS: Job[] = [
  {
    id: 1,
    title: "Senior Python Engineer",
    description:
      "We are hiring a Senior Python Engineer to own critical backend services at scale. " +
      "You will design and build FastAPI microservices, model PostgreSQL schemas, and ship REST APIs " +
      "consumed by millions of users. Experience integrating AI/ML or LLM-powered features is a strong plus. " +
      "You'll work closely with product and data teams in a fast-moving, backend-heavy engineering culture.",
    location: "Bengaluru",
    skills: ["Python", "FastAPI", "PostgreSQL", "REST APIs", "AI/ML"],
    experience_min: 4,
    experience_max: 8,
    status: "OPEN",
    created_at: hoursAgo(72),
  },
  {
    id: 2,
    title: "Frontend Engineer, React",
    description:
      "Build polished, production React + TypeScript interfaces for our recruiting platform. " +
      "You'll work with Tailwind CSS and a component-driven design system, collaborating tightly with design.",
    location: "Hyderabad",
    skills: ["React", "TypeScript", "Tailwind CSS"],
    experience_min: 2,
    experience_max: 5,
    status: "OPEN",
    created_at: hoursAgo(120),
  },
  {
    id: 3,
    title: "DevOps Engineer",
    description:
      "Own our Kubernetes infrastructure and CI/CD pipelines across AWS. Strong background in observability, " +
      "infra-as-code, and production incident response required.",
    location: "Pune",
    skills: ["Kubernetes", "AWS", "CI/CD"],
    experience_min: 3,
    experience_max: 6,
    status: "PAUSED",
    created_at: hoursAgo(300),
  },
  {
    id: 4,
    title: "Data Scientist",
    description:
      "Partner with the ML platform team to build and evaluate models that power candidate matching. " +
      "Strong Python and SQL fundamentals required.",
    location: "Bengaluru",
    skills: ["Python", "Machine Learning", "SQL"],
    experience_min: 3,
    experience_max: 7,
    status: "CLOSED",
    created_at: hoursAgo(900),
  },
];

export const DEMO_CANDIDATES: Candidate[] = [
  {
    id: 1,
    job_id: 1,
    name: "Priya Nair",
    email: "priya.nair@example.com",
    phone: "+91 98450 11223",
    title: "Senior Software Engineer",
    location: "Bengaluru",
    source: "LinkedIn",
    profile_url: "https://linkedin.com/in/demo-priya-nair",
    match_score: 0.94,
  },
  {
    id: 2,
    job_id: 1,
    name: "Rahul Verma",
    email: "rahul.verma@example.com",
    phone: "+91 90080 33445",
    title: "Backend Engineer",
    location: "Hyderabad",
    source: "LinkedIn",
    profile_url: "https://linkedin.com/in/demo-rahul-verma",
    match_score: 0.89,
  },
  {
    id: 3,
    job_id: 1,
    name: "Ananya Rao",
    email: "ananya.rao@example.com",
    phone: "+91 63645 77889",
    title: "Python Developer",
    location: "Bengaluru",
    source: "Naukri",
    profile_url: "https://naukri.com/demo-ananya-rao",
    match_score: 0.86,
  },
  {
    id: 4,
    job_id: 1,
    name: "Vikram Singh",
    email: "vikram.singh@example.com",
    phone: "+91 99001 22110",
    title: "Software Engineer II",
    location: "Pune",
    source: "LinkedIn",
    profile_url: "https://linkedin.com/in/demo-vikram-singh",
    match_score: 0.81,
  },
  {
    id: 5,
    job_id: 1,
    name: "Sneha Reddy",
    email: "sneha.reddy@example.com",
    phone: "+91 88705 44556",
    title: "Backend Developer",
    location: "Chennai",
    source: "Naukri",
    profile_url: "https://naukri.com/demo-sneha-reddy",
    match_score: 0.77,
  },
  {
    id: 6,
    job_id: 2,
    name: "Arjun Mehta",
    email: "arjun.mehta@example.com",
    phone: "+91 91234 55667",
    title: "Frontend Developer",
    location: "Hyderabad",
    source: "LinkedIn",
    profile_url: "https://linkedin.com/in/demo-arjun-mehta",
    match_score: 0.91,
  },
  {
    id: 7,
    job_id: 2,
    name: "Kavya Iyer",
    email: "kavya.iyer@example.com",
    phone: "+91 90333 12987",
    title: "UI Engineer",
    location: "Bengaluru",
    source: "LinkedIn",
    profile_url: "https://linkedin.com/in/demo-kavya-iyer",
    match_score: 0.85,
  },
];

export const DEMO_CALLS: Call[] = [
  {
    id: 1,
    candidate_id: 1,
    job_id: 1,
    hunar_call_id: "demo_call_priya",
    agent_id: "agent_demo_1",
    request_id: "req_demo_1",
    status: "COMPLETED",
    lifecycle_status: "ENDED",
    duration_seconds: 312,
    recording_url: null,
    result: {
      interested: "YES",
      qualified: "YES",
      experience: "5 years",
      notice_period: "30 days",
      expected_salary: "₹22 LPA",
      recommendation: "SHORTLIST",
    },
    created_at: hoursAgo(20),
    updated_at: hoursAgo(19),
  },
  {
    id: 2,
    candidate_id: 2,
    job_id: 1,
    hunar_call_id: "demo_call_rahul",
    agent_id: "agent_demo_1",
    request_id: "req_demo_2",
    status: "COMPLETED",
    lifecycle_status: "ENDED",
    duration_seconds: 198,
    recording_url: null,
    result: {
      interested: "YES",
      qualified: "NO",
      experience: "3 years",
      notice_period: "15 days",
      expected_salary: "₹14 LPA",
      recommendation: "REJECT",
    },
    created_at: hoursAgo(18),
    updated_at: hoursAgo(17),
  },
  {
    id: 3,
    candidate_id: 3,
    job_id: 1,
    hunar_call_id: "demo_call_ananya",
    agent_id: "agent_demo_1",
    request_id: "req_demo_3",
    status: "CALLING",
    lifecycle_status: "IN_PROGRESS",
    duration_seconds: null,
    recording_url: null,
    result: null,
    created_at: hoursAgo(0.1),
    updated_at: null,
  },
  {
    id: 4,
    candidate_id: 4,
    job_id: 1,
    hunar_call_id: "demo_call_vikram",
    agent_id: "agent_demo_1",
    request_id: "req_demo_4",
    status: "NOT_CONNECTED",
    lifecycle_status: "ENDED",
    duration_seconds: 0,
    recording_url: null,
    result: null,
    created_at: hoursAgo(5),
    updated_at: hoursAgo(5),
  },
  {
    id: 5,
    candidate_id: 5,
    job_id: 1,
    hunar_call_id: null,
    agent_id: "agent_demo_1",
    request_id: "req_demo_5",
    status: "QUEUED",
    lifecycle_status: null,
    duration_seconds: null,
    recording_url: null,
    result: null,
    created_at: hoursAgo(0.02),
    updated_at: null,
  },
];

export const DEMO_HUNAR_AGENTS: HunarAgent[] = [
  { id: "agent_demo_1", name: "Hiring Screener — English", description: "General screening agent" },
  { id: "agent_demo_2", name: "Hiring Screener — Hindi/English", description: "Bilingual screening agent" },
];

export const DEMO_HUNAR_NUMBERS: HunarPhoneNumber[] = [
  { id: "num_demo_1", phone_number: "+91 80 4567 1234", label: "Bengaluru Recruiting Line" },
  { id: "num_demo_2", phone_number: "+91 40 3345 9988", label: "Hyderabad Recruiting Line" },
];
