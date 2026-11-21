/**
 * Original editorial decision frameworks based on linked provider documentation,
 * not first-hand benchmarks or affiliate placements.
 * Only these independently researched guides are eligible for sitemap inclusion.
 */
export const AI_GUIDES_REVIEWED_ON = "2026-11-21";

export type ComparisonGuide = {
  slug: string;
  title: string;
  subtitle: string;
  firstSlug: string;
  secondSlug: string;
  intro: readonly string[];
  comparison: readonly { dimension: string; first: string; second: string; significance: string }[];
  scenarios: readonly { title: string; startingPoint: string; why: string; check: string }[];
  insights: readonly { title: string; paragraphs: readonly string[] }[];
  questions: readonly { question: string; answer: string }[];
  sources: readonly { label: string; url: string; supports: string }[];
  conclusion: string;
};

export const AI_COMPARISON_GUIDES: readonly ComparisonGuide[] = [
  {
    slug: "chatgpt-vs-claude",
    title: "ChatGPT vs Claude: Which workflow fits your work?",
    subtitle: "A source-led comparison of two general-purpose AI assistants for writing, document projects and multi-step work.",
    firstSlug: "chatgpt",
    secondSlug: "claude",
    intro: [
      "The useful question is not which assistant wins a universal contest. It is whether your daily work benefits more from a broad assistant workspace, an organized project knowledge base, or a particular way of producing reusable outputs. ChatGPT and Claude overlap substantially, so the right decision depends on your files, constraints and how you prefer to review results.",
      "For this guide, DECODISTA reviewed official ChatGPT plan documentation and Claude's pricing, Projects and Artifacts documentation. These sources establish what the providers describe—not relative accuracy, speed or writing quality. We have not performed a controlled hands-on model evaluation.",
    ],
    comparison: [
      {
        dimension: "Starting environment",
        first: "A general assistant interface with writing, research, file and tool access that varies by plan.",
        second: "An assistant interface with project organization and artifact creation described in its product documentation.",
        significance: "Begin with the workflow you will use most often; a feature's existence does not tell you how well it performs.",
      },
      {
        dimension: "Working across several tasks",
        first: "ChatGPT Work is described as a workspace for tasks across connected tools and files, with plan-dependent access.",
        second: "Claude Projects lets users organize chats around project instructions and uploaded knowledge.",
        significance: "Compare how you move between tasks versus how you keep an ongoing project anchored to a collection of sources.",
      },
      {
        dimension: "Turning responses into reusable work",
        first: "Document and file workflows are available, subject to the selected plan and feature access.",
        second: "Claude Artifacts supports documents, code and some interactive outputs, with capabilities determined by settings and plan.",
        significance: "Test your actual export and editing process instead of assuming that a polished preview is production-ready.",
      },
      {
        dimension: "Plan decisions",
        first: "Free, Go, Plus and Pro appear on the official individual plan comparison.",
        second: "Free, Pro, Max and Ultra are described in Claude's individual pricing.",
        significance: "Compare a specific checkout plan and its usage limits; the assistant names alone are not prices.",
      },
      {
        dimension: "Reliability and privacy",
        first: "No comparative quality score is published in this guide.",
        second: "No comparative quality score is published in this guide.",
        significance: "Check citations, sensitive-data controls and retention terms, and independently validate important answers.",
      },
    ],
    scenarios: [
      {
        title: "You switch between writing, research and other tools",
        startingPoint: "Begin by trialing ChatGPT",
        why: "Its product documentation emphasizes a broad assistant and workspace approach across tasks and connected tools. That may suit a mixed daily workflow.",
        check: "Confirm which connectors, Work tasks and file tools your actual account includes; do not assume every plan has equal access.",
      },
      {
        title: "You maintain a source-heavy project over weeks",
        startingPoint: "Begin by trialing Claude Projects",
        why: "Claude documents a project knowledge base that can be reused as context for conversations within that project. This offers a concrete organization model to evaluate.",
        check: "Upload a non-sensitive sample dossier, then check whether important details are applied consistently across several chats.",
      },
      {
        title: "You need a draft you can refine into a deliverable",
        startingPoint: "Trial both on exactly the same brief",
        why: "Each offers ways to produce substantial outputs, and Claude specifically documents Artifacts. The advertised format alone cannot establish the better result.",
        check: "Judge your ability to revise, export, correct factual mistakes and retain control of the final file—not aesthetic polish alone.",
      },
      {
        title: "You are considering a paid subscription",
        startingPoint: "Compare your two actual plan offers",
        why: "Pricing, feature gates and message or task limits differ, and local checkout terms may be more important than a headline feature.",
        check: "Use the official pricing links, estimate your typical weekly usage and verify taxes, currency and renewal terms before paying.",
      },
    ],
    insights: [
      {
        title: "Start with a repeatable task, not a model leaderboard",
        paragraphs: [
          "Pick one assignment you already understand: summarize a ten-page policy document, rewrite a difficult paragraph or outline a small research project. Give both products the same source material and success criteria. Count corrections and note whether the output stays traceable to the material, rather than scoring them by tone alone.",
          "If the first response is weak, perform a comparable second round of clarification in each tool. A meaningful comparison includes how easy it is to fix errors. Neither service can be treated as a substitute for checking consequential facts or the underlying documents.",
        ],
      },
      {
        title: "Projects and connected work answer different problems",
        paragraphs: [
          "An ongoing project knowledge base is appealing when you repeatedly refer to the same documents. A connected workspace becomes relevant when your task spans several tools or files. Those are not mutually exclusive benefits, and both providers can change their product surfaces.",
          "Ask where your information travels, what permissions are requested, and which material may be retained. Use redacted sample files first if your work involves confidential client material. Review each provider's privacy and organizational controls separately.",
        ],
      },
      {
        title: "Do not confuse plan access with proven performance",
        paragraphs: [
          "One subscription tier may unlock additional usage or features, but that does not automatically make its writing more accurate or its answers more useful for your subject. A free trial may be adequate for occasional tasks; demanding workflows can run into limits on either service.",
          "We intentionally avoid quoting a universal rupee price: tax, country, billing cadence and product changes make it misleading without a verified checkout in your region. Follow the official plan pages when the purchase is imminent.",
        ],
      },
    ],
    questions: [
      {
        question: "Is ChatGPT always better than Claude for writing?",
        answer: "No. This guide does not rank prose quality. Compare both on your own brief, including factual corrections, desired tone and export requirements.",
      },
      {
        question: "Does Claude Projects replace a document-management system?",
        answer: "No such claim is made. Projects can provide context for conversations, but permissions, document retention, source tracking and team workflows still require separate evaluation.",
      },
      {
        question: "Should I subscribe to both?",
        answer: "Not automatically. First identify a repeatable task that one plan cannot handle within its limits. Then evaluate whether the second tool offers enough practical benefit to justify an additional subscription.",
      },
    ],
    sources: [
      { label: "ChatGPT plans and features", url: "https://chatgpt.com/pricing/", supports: "Individual tiers and plan-dependent access" },
      { label: "ChatGPT Work overview", url: "https://chatgpt.com/work/", supports: "Connected work and task-oriented workspace" },
      { label: "Claude individual pricing", url: "https://claude.com/pricing", supports: "Individual tier names and plan boundaries" },
      { label: "Claude Projects help", url: "https://support.claude.com/en/articles/9517075-what-are-projects", supports: "Project knowledge and context model" },
      { label: "Claude Artifacts help", url: "https://support.claude.com/en/articles/17153992-what-are-artifacts-and-how-do-i-use-them", supports: "Artifact output formats and capabilities" },
    ],
    conclusion: "Begin with the service that matches your most common work pattern. Use the same non-sensitive test task in both if your choice is close, document the mistakes you must fix, and verify the actual plan terms. No single tool can be declared the better writer or researcher from product documentation alone.",
  },
  {
    slug: "cursor-vs-github-copilot",
    title: "Cursor vs GitHub Copilot: Editor workflow or cross-tool assistance?",
    subtitle: "An evidence-based guide to two developer assistants, focusing on where work happens and how changes get reviewed.",
    firstSlug: "cursor",
    secondSlug: "github-copilot",
    intro: [
      "A coding assistant is only as useful as its fit with your development environment. The meaningful distinction is not a blanket claim about who writes better code. It is how each product fits into an editor, terminal, repository and review process—and whether using it introduces more change than your team can safely verify.",
      "Cursor documents an AI-centered editor with Agent and codebase workflows. GitHub describes Copilot assistance across supported IDEs, its own tools and GitHub-related surfaces. Both have agent capabilities. We compared their official documentation, not measured code quality, latency or security defect rates.",
    ],
    comparison: [
      {
        dimension: "Where you begin",
        first: "Cursor is itself an AI-oriented coding editor, with codebase exploration and agent workflows at the center.",
        second: "Copilot supports several IDEs, GitHub workflows and command-line experiences, with availability varying by surface.",
        significance: "If changing your editor is expensive, extension and platform fit may matter more than feature labels.",
      },
      {
        dimension: "Agent-driven edits",
        first: "Cursor Agent can edit files, run terminal commands and help with multi-file coding tasks.",
        second: "Copilot offers agent capabilities across supported environments, including coding workflows tied to GitHub.",
        significance: "Both need a controlled branch, precise scope, test coverage and human code review.",
      },
      {
        dimension: "Repository context",
        first: "Cursor's documentation highlights searching and understanding an open codebase.",
        second: "GitHub's documentation describes repository-aware assistance and workflows across the code lifecycle.",
        significance: "Try navigation and change planning in your own repository, especially a large or unfamiliar one.",
      },
      {
        dimension: "IDE and team fit",
        first: "An editor-centered workflow suits teams willing to adopt or standardize around Cursor.",
        second: "Copilot can operate inside supported IDEs such as VS Code, Visual Studio and JetBrains environments.",
        significance: "A team's existing editor, branch policy and security rules can be decisive procurement constraints.",
      },
      {
        dimension: "Cost and governance",
        first: "Pricing and usage are governed by Cursor's current subscriptions and model allowances.",
        second: "Copilot's documentation describes individual plans, usage or credits and organizational controls.",
        significance: "Check the current paid-plan terms, agent credit limits and admin policies rather than relying on old price charts.",
      },
    ],
    scenarios: [
      {
        title: "You want an AI-first editor as your main coding environment",
        startingPoint: "Try Cursor on a throwaway branch",
        why: "Its documentation is built around editor-native Agent, codebase search, planning and file-editing workflows.",
        check: "Confirm editor compatibility, extensions, keybindings and review quality before migrating an established workspace.",
      },
      {
        title: "Your team already uses several IDEs and GitHub",
        startingPoint: "Try GitHub Copilot within existing tools",
        why: "The supported IDE and GitHub/CLI surfaces offer a way to evaluate AI help without requiring everyone to adopt a different primary editor.",
        check: "Confirm features in each exact IDE and your organization, because availability is not uniform across all surfaces.",
      },
      {
        title: "You are assigning a large multi-file refactor",
        startingPoint: "Run the same scoped task in separate test branches",
        why: "Both products describe agentic capabilities. A benchmark without identical scope, repository version and checks would not justify choosing one.",
        check: "Use a small target, require a plan before editing, inspect the diff, run tests and compare maintainability rather than lines changed.",
      },
      {
        title: "You care about sensitive code and compliance",
        startingPoint: "Audit both products' policy and data settings first",
        why: "Organization policy, supported features, access controls and code handling often matter more than an isolated demo.",
        check: "Use a sandbox repo with no secrets; review code access, retention, licensing and human approval requirements with your security team.",
      },
    ],
    insights: [
      {
        title: "The unit of comparison should be the pull request",
        paragraphs: [
          "For a useful test, define one change request with acceptance criteria, a fixed repository commit, a clean branch and a test suite. Give each assistant the same task. Review the actual patch: does it minimize unnecessary edits, preserve existing conventions and explain the tradeoffs? A successful command output is not proof that the result is safe to merge.",
          "Track whether the tool modified unrelated files or changed dependency versions without a clear need. Compare the number and severity of corrections required. This procedure is more informative than asking which product generates more code in one prompt.",
        ],
      },
      {
        title: "Editor preference and product integration have a real cost",
        paragraphs: [
          "Adopting a new editor can affect debugging shortcuts, extensions, onboarding and shared team instructions. If that disruption matters, start by testing Copilot within your existing setup. If an editor-first agent workflow is the goal, evaluate Cursor with the same source tree and engineering standards.",
          "Neither product should be portrayed as only autocomplete: both have broader agent workflows described in current documentation. Equally, the presence of an agent does not guarantee that it runs every command, model or integration on every subscription.",
        ],
      },
      {
        title: "Protect the boundaries of automated coding",
        paragraphs: [
          "Use least-privilege access, avoid live credentials and require a human to approve database migrations, deployment changes and potentially destructive commands. Consider which tool logs actions, what files it can read and where data is processed. These controls should be checked against current policy documents, not presumed from marketing copy.",
          "AI-generated tests can mirror the same misunderstanding as the implementation. Maintain independent acceptance checks and a meaningful review. For high-impact code, include security and regression validation regardless of which assistant you choose.",
        ],
      },
    ],
    questions: [
      {
        question: "Is Cursor automatically better at code generation?",
        answer: "No. We did not run comparative code-quality benchmarks. Cursor's editor-centric product design is a workflow distinction, not a verified performance victory.",
      },
      {
        question: "Does GitHub Copilot only work in VS Code?",
        answer: "No. GitHub documents several supported IDEs and other Copilot surfaces. Exact features and availability depend on the environment and plan.",
      },
      {
        question: "Can either tool safely merge a change without review?",
        answer: "Neither should be granted that assumption from documentation. Require code review, tests, permission checks and explicit approval for sensitive changes.",
      },
    ],
    sources: [
      { label: "Cursor Agent overview", url: "https://cursor.com/docs/agent/overview", supports: "Editing, terminal and agent workflows" },
      { label: "Cursor documentation", url: "https://cursor.com/docs", supports: "Editor, codebase and developer workflow positioning" },
      { label: "GitHub Copilot overview", url: "https://docs.github.com/en/copilot/get-started/about-github-copilot", supports: "Coding assistant, code context and agent features" },
      { label: "Where GitHub Copilot works", url: "https://docs.github.com/en/copilot/get-started/where-to-use-github-copilot", supports: "IDE, terminal and repository workflow coverage" },
      { label: "Copilot plans", url: "https://docs.github.com/en/copilot/get-started/plans", supports: "Plan-specific availability and usage conditions" },
    ],
    conclusion: "If your primary aim is adopting an AI-centered editor, put Cursor through a controlled trial. If continuity across existing IDEs and GitHub workflows is more important, begin with Copilot. In either case, choose only after a real pull-request trial, a review of permission boundaries and a check of your plan's actual usage limits.",
  },
];

export function findAiComparisonGuide(slug: string) {
  return AI_COMPARISON_GUIDES.find((item) => item.slug === slug);
}

export function findGuideForTools(firstSlug: string, secondSlug: string) {
  return AI_COMPARISON_GUIDES.find((item) =>
    (item.firstSlug === firstSlug && item.secondSlug === secondSlug) ||
    (item.firstSlug === secondSlug && item.secondSlug === firstSlug)
  );
}
