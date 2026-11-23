import { AI_ALTERNATIVE_JOBS, getAiToolJobs, type AiAlternativeJob } from "@/lib/ai-tools-alternatives";

/**
 * Editorially CURATED listed use cases, not independent feature verification.
 * Missing taxonomy labels are unknown, never treated as proof of unavailability.
 */
export type AiWorkflowComparisonRow = {
  job: AiAlternativeJob;
  label: string;
  firstListed: boolean;
  secondListed: boolean;
};

export function compareListedAiWorkflows(firstSlug: string, secondSlug: string) {
  const firstJobs = new Set(getAiToolJobs(firstSlug));
  const secondJobs = new Set(getAiToolJobs(secondSlug));
  const rows: AiWorkflowComparisonRow[] = [...new Set([...firstJobs, ...secondJobs])]
    .map((job) => ({
      job,
      label: AI_ALTERNATIVE_JOBS[job],
      firstListed: firstJobs.has(job),
      secondListed: secondJobs.has(job),
    }))
    .sort((a, b) => {
      const rank = (row: AiWorkflowComparisonRow) =>
        row.firstListed && row.secondListed ? 0 : row.firstListed ? 1 : 2;
      return rank(a) - rank(b) || a.label.localeCompare(b.label, "en");
    });

  const sharedCount = rows.filter((row) => row.firstListed && row.secondListed).length;
  return {
    rows,
    sharedCount,
    firstOnlyCount: rows.filter((row) => row.firstListed && !row.secondListed).length,
    secondOnlyCount: rows.filter((row) => !row.firstListed && row.secondListed).length,
  };
}
