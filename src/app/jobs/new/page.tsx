import { PageHeader } from "@/components/shared/page-header";
import { CreateJobForm } from "@/components/jobs/create-job-form";

export default function NewJobPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Create Job" subtitle="Paste a job description and let AI derive the screening criteria." />
      <CreateJobForm />
    </div>
  );
}
