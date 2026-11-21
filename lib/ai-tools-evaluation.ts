/**
 * Synthetic, first-party prompts for visitor-run evaluations.
 * No provider output, score or benchmarking result is stored in this file.
 */
export type EvaluationTask = {
  id: string;
  title: string;
  aim: string;
  prompt: string;
  checklist: readonly string[];
};

export const AI_EVALUATION_TASKS: Readonly<Record<string, readonly EvaluationTask[]>> = {
  "chatgpt-vs-claude": [
    {
      "id": "source-accuracy",
      "title": "01 / Grounded summary with a missing fact",
      "aim": "Check accuracy, arithmetic and whether the response avoids inventing missing data.",
      "prompt": "You are preparing a short internal update. Use ONLY the fictional source below.\n\nSOURCE:\n[1] Cedar Library pilot received 120 support requests in August.\n[2] In September it received 102 support requests.\n[3] The September survey had 80 respondents; 60 rated the experience positively.\n[4] The number of survey respondents in August was not recorded.\n[5] The pilot's operating budget has not been published.\n\nTASK: Write a neutral 100–130 word update with three bullet points. State the change in requests in absolute and percentage terms, citing source line numbers. State the positive-survey share for September. Clearly mention missing information. Do not introduce outside facts.",
      "checklist": [
        "Requests fell by 18, a 15% decrease from 120.",
        "September positive share: 60 / 80 = 75%.",
        "No invented August survey comparison or operating budget.",
        "Exactly three bullets and traceable source line references."
      ]
    },
    {
      "id": "writing-constraints",
      "title": "02 / Rewrite without changing commitments",
      "aim": "Test clear writing under specific factual constraints.",
      "prompt": "Fictional internal meeting notice:\nHi everyone we moved training from 4 March to 11 March 2027. It's from 10:00 to 11:30 AM, meeting room B. Bring a laptop and read the 2-page brief. We are NOT asking people to submit anything before the meeting. RSVP by 6 March to training@example.invalid.\n\nTASK: Rewrite as a clear, polite email of at most 110 words. Include a subject line and preserve every date, time, location, preparation item, RSVP destination and the explicit no-submission requirement. Add no new deadline.",
      "checklist": [
        "Correct date, time and Room B.",
        "Laptop, two-page brief and no-submission condition.",
        "RSVP deadline and example.invalid address unchanged.",
        "Useful subject line, no more than 110 words."
      ]
    },
    {
      "id": "planning-constraints",
      "title": "03 / Plan within a hard capacity limit",
      "aim": "Evaluate realistic planning without hidden resources.",
      "prompt": "A fictional newsletter team has one editor with six available hours next week. Options: fact-check three stories (one hour each), edit three stories (one hour each), design two cover images (one hour each), and write a style guide (two hours). No staff, parallel work or overtime is available.\n\nTASK: Create a one-week plan using at most six total hours. State what WILL NOT be completed. Show a task-by-task time total. Explain prioritization in four sentences or fewer. Do not invent resources.",
      "checklist": [
        "Proposed work takes no more than six editor-hours.",
        "Names deferred tasks explicitly.",
        "Time allocation can be checked step by step.",
        "No invented extra help, parallel execution or overtime."
      ]
    }
  ],
  "cursor-vs-github-copilot": [
    {
      "id": "typed-function",
      "title": "01 / Implement a precise TypeScript function",
      "aim": "Test implementation against explicit behavior and examples.",
      "prompt": "Implement this TypeScript function without packages:\nexport function normalizeTags(input: string): string[]\n\nRequirements: split on commas, trim whitespace, lowercase, drop empty values, remove duplicates while preserving first-seen order. Do not use global state or mutate the input.\n\nSupply the implementation and Node-friendly tests for:\n\" AI, ai , CODE, , code \" => [\"ai\", \"code\"]\n\"\" => []\n\"  Red, BLUE ,red \" => [\"red\", \"blue\"]\nExplain edge cases in at most five sentences.",
      "checklist": [
        "All example cases match.",
        "Order-preserving case-insensitive deduplication.",
        "No dependencies, globals or unrelated changes.",
        "Runnable tests and concise explanation."
      ]
    },
    {
      "id": "bug-fix",
      "title": "02 / Fix a bug with a minimal patch",
      "aim": "Assess patch scope and tests.",
      "prompt": "Review the function, which should count unique case-insensitive words:\n\nexport function uniqueWordCount(words: string[]): number {\n  const seen = new Set<string>();\n  for (const word of words) {\n    seen.add(word.trim());\n  }\n  return seen.size;\n}\n\nRequirements: ignore blank words; normalize case with toLowerCase(); do not mutate input, change the function signature, edit unrelated files or add dependencies. Provide a small unified diff and tests:\n[\"Apple\", \" apple \", \"BANANA\"] => 2\n[\" \", \"\", \"a\"] => 1\n[] => 0\nExplain the fix.",
      "checklist": [
        "Normalizes case and excludes empty words.",
        "Minimal patch rather than unrelated rewriting.",
        "Tests all supplied examples.",
        "Preserves signature and avoids mutation/dependencies."
      ]
    },
    {
      "id": "review-changes",
      "title": "03 / Review a synthetic pull request",
      "aim": "Find real flaws and admit what static inspection cannot prove.",
      "prompt": "Act as a TypeScript pull-request reviewer. Review ONLY this synthetic patch:\n\nexport function average(values: number[]): number {\n  const sum = values.reduce((acc, value) => acc + value, 0);\n  return sum / values.length;\n}\n\nPublished contract: return null for an empty array; reject non-finite numbers with RangeError; otherwise return arithmetic mean.\n\nTASK: List concrete issues with severity and reproducing inputs. Propose the smallest correction and adjust types if needed. Give tests for [], [2, 4] and [1, Number.POSITIVE_INFINITY]. Identify which behavior cannot be verified from source alone. Do not claim you ran code or tests.",
      "checklist": [
        "Flags division by zero and non-finite values.",
        "Type-correct minimal correction and good tests.",
        "No invented vulnerabilities or execution claims.",
        "Distinguishes static review from actual test execution."
      ]
    }
  ]
};

export function getAiEvaluationTasks(slug: string): readonly EvaluationTask[] {
  return AI_EVALUATION_TASKS[slug] ?? [];
}
