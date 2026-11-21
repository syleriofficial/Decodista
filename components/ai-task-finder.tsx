"use client";

import { useState } from "react";
import Link from "@/components/app-link";
import { ArrowRight, BookOpen, GitCompareArrows } from "lucide-react";
import { findAiTool } from "@/lib/ai-tools";
import { trackAiToolsInteraction } from "@/lib/ai-tools-interactions";
import { getAiToolEvidence } from "@/lib/ai-tools-evidence";

type Task = {
  id: string;
  label: string;
  intro: string;
  options: readonly { slug: string; purpose: string }[];
  caution: string;
};

/**
 * Human-curated workflow entry points from the existing source-checked catalog.
 * Order is for illustrating complementary product purposes, NOT an editorial
 * ranking, live scoring system or tested winner.
 */
const TASKS: readonly Task[] = [
  {
    id: "research",
    label: "Research a topic",
    intro: "Compare web-source discovery with research around documents you supply.",
    options: [
      { slug: "perplexity", purpose: "Explore web information and follow source links." },
      { slug: "notebooklm", purpose: "Study your own documents and inspect source-linked answers." },
    ],
    caution: "Web citations and source-linked summaries still need verification against the original material.",
  },
  {
    id: "writing",
    label: "Write and edit",
    intro: "Explore general-purpose assistants for drafting and improving text.",
    options: [
      { slug: "chatgpt", purpose: "Draft, revise and discuss written work." },
      { slug: "claude", purpose: "Work on drafts and document-heavy writing tasks." },
      { slug: "gemini", purpose: "Explore writing and planning in Google's assistant." },
    ],
    caution: "These are documented product roles, not measured writing-quality scores.",
  },
  {
    id: "coding",
    label: "Build software",
    intro: "Choose a starting point for assistance inside developer workflows.",
    options: [
      { slug: "cursor", purpose: "Explore code and edit files in an AI-focused editor." },
      { slug: "github-copilot", purpose: "Get coding support in supported developer environments." },
    ],
    caution: "Generated code requires testing, review and security checks before release.",
  },
  {
    id: "visuals",
    label: "Create visuals",
    intro: "Explore AI-assisted image generation, visual editing and design.",
    options: [
      { slug: "adobe-firefly", purpose: "Create and edit visuals with Adobe's generative tools." },
      { slug: "midjourney", purpose: "Explore visual concepts and generated artwork." },
      { slug: "canva", purpose: "Combine design templates and AI-assisted creative tools." },
    ],
    caution: "Check each provider's licensing, plan access and image-use permissions.",
  },
  {
    id: "video",
    label: "Generate video",
    intro: "Explore tools for creating moving-image assets.",
    options: [
      { slug: "runway", purpose: "Try text- or image-led generative video workflows." },
      { slug: "adobe-firefly", purpose: "Explore video generation inside Adobe's creative ecosystem." },
    ],
    caution: "Video credits, supported models and output rights depend on the selected plan.",
  },
  {
    id: "voice",
    label: "Narration and dubbing",
    intro: "Start with a platform built around synthetic speech and dubbing.",
    options: [
      { slug: "elevenlabs", purpose: "Explore text-to-speech, voiceover and dubbing workflows." },
    ],
    caution: "Use voices only with the necessary consent and commercial permissions.",
  },
  {
    id: "presentations",
    label: "Make presentations",
    intro: "Explore slide and design workflows without claiming a cross-product winner.",
    options: [
      { slug: "canva", purpose: "Design presentation slides with templates and AI assistance." },
    ],
    caution: "Feature access and template/export rights can vary between plans.",
  },
] as const;

export function AiTaskFinder() {
  const [activeTask, setActiveTask] = useState(TASKS[0].id);
  const task = TASKS.find((item) => item.id === activeTask) ?? TASKS[0];
  const pair = task.options.length > 1
    ? `/ai-tools/compare?first=${encodeURIComponent(task.options[0].slug)}&second=${encodeURIComponent(task.options[1].slug)}`
    : null;

  return (
    <section className="ai-task-finder wrap" aria-labelledby="ai-task-finder-heading" id="ai-task-finder">
      <div className="ai-task-finder-heading">
        <span className="ai-tools-eyebrow">Start with your job</span>
        <h2 id="ai-task-finder-heading">What do you want AI to help you do?</h2>
        <p>Choose a task to see a small, source-linked shortlist. No sign-up, paid placement or untested winners.</p>
      </div>
      <div className="ai-task-options" role="group" aria-label="Choose an AI task">
        {TASKS.map((item) => (
          <button
            type="button"
            key={item.id}
            className={item.id === activeTask ? "ai-task-option is-active" : "ai-task-option"}
            aria-pressed={item.id === activeTask}
            onClick={() => {
              if (item.id === activeTask) return;
              setActiveTask(item.id);
              trackAiToolsInteraction({ name: "ai_tools_task_select", task_id: item.id });
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="ai-task-panel" aria-live="polite" aria-atomic="true">
        <div className="ai-task-panel-intro">
          <h3>{task.label}</h3>
          <p>{task.intro}</p>
        </div>
        <div className="ai-task-matches">
          {task.options.map((option) => {
            const tool = findAiTool(option.slug);
            const evidence = getAiToolEvidence(option.slug);
            return (
              <article key={option.slug} className="ai-task-match">
                <h4><Link href={`/ai-tools/${tool.slug}`}>{tool.name}</Link></h4>
                <p>{option.purpose}</p>
                <small><BookOpen size={14} aria-hidden="true" /> {evidence ? `Official docs checked ${evidence.checkedOn}` : "Documentation review pending"}</small>
                <Link href={`/ai-tools/${tool.slug}`} className="ai-task-match-link">
                  Explore profile <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
        <div className="ai-task-panel-foot">
          <p><strong>Before you choose:</strong> {task.caution} This is a descriptive shortlist, not a comparative benchmark.</p>
          {pair && <Link href={pair} className="ai-task-compare-link"><GitCompareArrows size={16} aria-hidden="true" /> Compare two starting points</Link>}
          {task.id === "research" && <Link href="/ai-tools/guides/perplexity-vs-gemini-notebook" className="ai-task-compare-link"><BookOpen size={16} aria-hidden="true" /> Read source-led research guide</Link>}
          {task.id === "research" && <Link href="/ai-tools/guides/chatgpt-vs-gemini-for-research" className="ai-task-compare-link"><BookOpen size={16} aria-hidden="true" /> ChatGPT vs Gemini research guide</Link>}
        </div>
      </div>
    </section>
  );
}
