"use client";

import { useState, type FormEvent } from "react";
import Link from "@/components/app-link";
import { ArrowRight, BookOpen, GitCompareArrows, Search, Sparkles } from "lucide-react";
import { findAiTool } from "@/lib/ai-tools";
import { trackAiToolsInteraction } from "@/lib/ai-tools-interactions";
import { getAiToolEvidence } from "@/lib/ai-tools-evidence";
import { matchSmartFinderTask, type SmartFinderResult } from "@/lib/ai-tools-smart-finder";

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
    id: "app-building",
    label: "Build an app",
    intro: "Explore prompt-driven app builders. Deployment options, source-code control and usage billing differ.",
    options: [
      { slug: "lovable", purpose: "Build web apps from prompts, with databases and hosted app features." },
      { slug: "bolt", purpose: "Create websites and web apps and iterate on generated projects." },
      { slug: "replit", purpose: "Use an AI Agent inside an integrated development and deployment workspace." },
    ],
    caution: "Check generated code, deployment configuration and recurring infrastructure costs before launch.",
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
      { slug: "gamma", purpose: "Generate presentations and make AI-assisted slide edits." },
    ],
    caution: "Feature access and template/export rights can vary between plans.",
  },
] as const;

const SMART_FINDER_EXAMPLES = [
  "Build a website without coding",
  "Summarize research PDFs",
  "Make presentation slides",
  "Generate a voiceover",
] as const;

export function AiTaskFinder() {
  const [activeTask, setActiveTask] = useState(TASKS[0].id);
  const [request, setRequest] = useState("");
  const [finderResult, setFinderResult] = useState<SmartFinderResult | null>(null);
  const task = TASKS.find((item) => item.id === activeTask) ?? TASKS[0];
  // Never show an earlier task's recommendations for an unknown or ambiguous request.
  const canShowTaskPanel = !finderResult || (!finderResult.ambiguous && finderResult.matchedTasks.length === 1);
  const pair = task.options.length > 1
    ? "/ai-tools/compare?first=" + encodeURIComponent(task.options[0].slug) + "&second=" + encodeURIComponent(task.options[1].slug)
    : null;

  const chooseTask = (id: string) => {
    if (id === activeTask) return;
    setActiveTask(id);
    trackAiToolsInteraction({ name: "ai_tools_task_select", task_id: id });
  };

  const interpret = (value: string) => {
    const result = matchSmartFinderTask(value);
    setRequest(value);
    setFinderResult(result);
    if (result.matchedTasks.length === 1) setActiveTask(result.matchedTasks[0]);
    // Ambiguous or unrecognized text never silently selects an intent.
  };

  const onFind = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    interpret(request);
  };

  return (
    <section className="ai-task-finder wrap" aria-labelledby="ai-task-finder-heading" id="ai-task-finder">
      <div className="ai-task-finder-heading">
        <span className="ai-tools-eyebrow">Smart Finder 2.3 / Start with your job</span>
        <h2 id="ai-task-finder-heading">What do you want AI to help you do?</h2>
        <p>Describe your goal or choose a task. We map it to documented uses among 16 tools—without sending your words to an AI service.</p>
      </div>

      <div className="ai-task-smart" aria-label="Describe what you need">
        <form className="ai-task-smart-form" onSubmit={onFind}>
          <label htmlFor="ai-smart-finder-input">Describe what you want to accomplish</label>
          <div className="ai-task-smart-input-row">
            <input id="ai-smart-finder-input" type="search" maxLength={220}
              placeholder="e.g. Build a website without coding"
              value={request}
              onChange={(event) => {
                setRequest(event.target.value);
                setFinderResult(null);
              }}
              autoComplete="off"
            />
            <button type="submit" disabled={!request.trim()}>
              <Search size={17} aria-hidden="true" /> Find tools
            </button>
          </div>
        </form>
        <div className="ai-task-smart-examples" aria-label="Example requests">
          <span>Try an example</span>
          {SMART_FINDER_EXAMPLES.map((example) => (
            <button type="button" key={example} onClick={() => interpret(example)}>{example}</button>
          ))}
        </div>
        <p className="ai-task-smart-privacy">
          <Sparkles size={15} aria-hidden="true" /> On-device keyword matching. Your request stays in this tab—no API call, account, stored prompt or text sent to analytics.
        </p>
      </div>

      {finderResult && (
        <div className="ai-task-smart-result" role="status" aria-live="polite" aria-atomic="true">
          {finderResult.matchedTasks.length === 0 ? (
            <>
              <strong>No confident task match yet.</strong>
              <p>Try describing the output you need (app, slides, image, research, code, video, voice or writing), or choose a task below. No tools are suggested for this request.</p>
            </>
          ) : finderResult.ambiguous ? (
            <>
              <strong>More than one type of work could fit.</strong>
              <p>Select the closest task below. These are possible interpretations, not tool rankings.</p>
              <div className="ai-task-smart-choices">
                {finderResult.matchedTasks.map((id) => (
                  <button key={id} type="button" onClick={() => {
                    setActiveTask(id);
                    setFinderResult({ matchedTasks: [id], ambiguous: false });
                    trackAiToolsInteraction({ name: "ai_tools_task_select", task_id: id });
                  }}>
                    {TASKS.find((item) => item.id === id)?.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <strong>Possible task: {TASKS.find((item) => item.id === finderResult.matchedTasks[0])?.label}</strong>
              <p>Start with the source-linked options below. This is keyword-based task matching—not a test, quality score, cheapest-price verdict or guaranteed feature match.</p>
            </>
          )}
        </div>
      )}

      <div className="ai-task-options" role="group" aria-label="Choose an AI task">
        {TASKS.map((item) => (
          <button
            type="button"
            key={item.id}
            className={canShowTaskPanel && item.id === activeTask ? "ai-task-option is-active" : "ai-task-option"}
            aria-pressed={canShowTaskPanel && item.id === activeTask}
            onClick={() => {
              // Even the previously selected task must recover from no-match.
              setFinderResult(null);
              chooseTask(item.id);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {canShowTaskPanel && (
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
                <h4><Link href={"/ai-tools/" + tool.slug}>{tool.name}</Link></h4>
                <p>{option.purpose}</p>
                <small><BookOpen size={14} aria-hidden="true" /> {evidence ? "Official docs checked " + evidence.checkedOn : "Documentation review pending"}</small>
                <Link href={"/ai-tools/" + tool.slug} className="ai-task-match-link">
                  Explore profile <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
        <div className="ai-task-panel-foot">
          <p><strong>Before you choose:</strong> {task.caution} This is a descriptive shortlist, not a comparative benchmark.</p>
          {pair && <Link href={pair} className="ai-task-compare-link"><GitCompareArrows size={16} aria-hidden="true" /> Compare two starting points</Link>}
        </div>
      </div>
      )}
    </section>
  );
}
