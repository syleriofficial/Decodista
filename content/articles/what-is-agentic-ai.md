---
title: "What Is Agentic AI? How AI Agents Work, Where They Fail and What to Watch"
slug: what-is-agentic-ai
deck: >-
  AI agents can act through connected tools. Here is how they work, where
  independent research finds weaknesses, and which safeguards matter before
  delegating consequential decisions.
primaryCategory: ai
contentType: explainer
topics:
  - Agentic AI
  - AI Agents
  - Artificial Intelligence
  - Automation
  - AI Security
  - Prompt Injection
  - AI Reliability
heroImage: /images/uploads/what-is-agentic-ai.webp
heroImageAlt: Conceptual illustration showing an AI agent linked to a goal, authorized tools, result verification and human approval.
heroImageWidth: 1600
heroImageHeight: 900
shortAnswer: >-
  **Agentic AI is software that uses an AI model to pursue a goal through
  connected tools and a sequence of actions.** An agent can plan, act, inspect
  the result and change course within permissions set by its operator.
  Some actions may be automated; consequential decisions should be governed
  by enforceable access limits and appropriate human authorization.
keyTakeaways:
  - "Agentic AI can take permitted actions, not just generate advice. Calling a product an agent does not tell you which permissions it has."
  - "An agent's model is only one component. Tool access, execution rules and approval controls determine what it can actually do."
  - "A successful demo is not proof of repeatable reliability. The peer-reviewed τ-bench study tested policy-compliant results across repeated attempts."
  - "Prompt injection and excessive privileges can turn untrusted material into consequential actions."
  - "Security agencies recommend beginning with low-risk, non-sensitive tasks and enforcing boundaries in software."
introduction: |-
  Ask a chatbot about a duplicate charge on your bill and it may explain how to request a refund.

  Ask an AI agent connected to a billing system and it could locate the charge, prepare a refund and queue it for approval. The second scenario is more useful—and potentially more dangerous. A wrong answer can become a wrong action.

  That shift from software that responds to software that acts is what people mean by **agentic AI**. The term is applied broadly, so the important questions are what an agent is allowed to do, how reliably it works and who remains responsible when something goes wrong.
faqs:
  - question: Is agentic AI the same as a chatbot?
    id: agentic-ai-vs-chatbot
    answer: A basic chatbot mainly generates responses. An agentic system can also take permitted actions through connected software. Some AI assistants combine both capabilities.
  - question: Is agentic AI the same as AGI?
    id: agentic-ai-vs-agi
    answer: No. Agentic AI describes goal-directed actions. Artificial general intelligence (AGI) concerns broad intellectual capability, a concept whose exact definition remains debated. Autonomy does not establish human-like general intelligence.
  - question: Can AI agents work without supervision?
    id: can-ai-agents-work-unsupervised
    answer: Some can complete selected tasks without continuous attention. Whether that is appropriate depends on the system's permissions, failure consequences and the ability to reverse errors.
  - question: How can I tell whether an AI agent is reliable?
    id: how-to-test-ai-agent-reliability
    answer: Evaluate representative tasks repeatedly, verify the final outcomes and policy compliance, measure correction effort, and test failure handling. Security testing should be separate from ordinary task-success testing.
  - question: Should every company use AI agents?
    id: should-every-company-use-ai-agents
    answer: No. When a task is predictable, conventional automation may be less expensive and easier to test. An agent should provide an identifiable improvement that justifies its complexity and risk.
publishedAt: 2026-11-22
informationCheckedAt: 2026-11-22
author: DECODISTA Editorial
readingTime: 12
seoTitle: "What Is Agentic AI? How It Works, Examples and Risks"
metaDescription: >-
  Agentic AI can plan and act through connected tools. Learn how AI agents work,
  see real examples, and understand their reliability and security risks.
relatedArticles:
  - ai-shopping-agents-scam-fraud-privacy-risks
editorsPick: false
featured: false
sourcesVerification: |-
  This research-based explainer was prepared with AI assistance, then edited using the primary sources linked below. DECODISTA has **not** conducted hands-on tests of the products or models discussed. GitHub controls are described from provider documentation, not as independently verified defenses. The billing and appointment scenarios and numerical illustrations are hypothetical. Editorial conclusions are distinguished from measured findings.

  **Research and documentation reviewed November 22, 2026:**

  1. [Yao et al., τ-bench, ICLR 2025](https://proceedings.iclr.cc/paper_files/paper/2025/hash/1b126cc38b8638e07bef37e7b2bb72bf-Abstract-Conference.html) — peer-reviewed benchmark and pass^k measure.
  2. [NIST CAISI, AI Agent Security, March 2026](https://www.nist.gov/blogs/caissi-research-blog/insights-ai-agent-security-large-scale-red-teaming-competition) — public red-teaming competition summary.
  3. [Related agent-security research, arXiv:2603.15714](https://arxiv.org/abs/2603.15714) — preprint; peer review not established here.
  4. [Canadian Centre for Cyber Security, Careful Adoption of Agentic AI](https://www.cyber.gc.ca/en/guidance/careful-adoption-agentic-ai) — joint government-agency security guidance.
  5. [GitHub, Copilot Cloud Agent Risks and Mitigations](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/risks-and-mitigations) — documented controls.
  6. [GitHub, Getting Pull Requests Ready With Agent Merge](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/watch-and-fix-pull-requests) — merge-workflow limitations.
  7. [Stack Overflow, Agents on a Leash, May 2026](https://stackoverflow.blog/2026/05/27/agents-on-a-leash-agentic-ai-remains-mostly-monitored-at-work/) — April pulse survey.
  8. [Stack Overflow, 2026 Developer Survey](https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here) — distinct October survey.
---

## What is agentic AI?

An AI agent is generally built around a model, often a large language model, connected to software tools, information and execution rules. Given an objective, it may choose which permitted steps to take, inspect the outcome and adjust its approach.

The [Canadian Centre for Cyber Security and international partner agencies](https://www.cyber.gc.ca/en/guidance/careful-adoption-agentic-ai) describe this combination of models, tools, data, memory and planning workflows as enabling systems to pursue loosely specified objectives with less continuous direction.

Autonomy is a spectrum, not an on/off switch. An agent might look up information independently while requiring approval before changing a record or committing money. Calling software "agentic" does not establish how much authority it has—or how intelligent its model is.

## How does an AI agent work?

An agent typically runs a loop:

1. **Receive an objective.** A person or authorized trigger defines the desired result.
2. **Plan the work.** The model identifies what it needs to find out or do.
3. **Act through a tool.** It calls a permitted API, searches a database, edits a file or performs another allowed operation.
4. **Observe the outcome.** It reads the result, including errors and missing information.
5. **Continue, finish or escalate.** It chooses another step, delivers a result or asks a person for help.

![Five stages of an AI agent workflow, from receiving a goal and planning to using tools, checking results and requesting approval](/images/editorial/agentic-ai-agent-loop.svg "Conceptual workflow. Tool use and result checking may repeat before the agent finishes.")

Steps three and four may repeat many times. The model is only one component. Software around it supplies tools, memory, permissions and control over execution.

That distinction matters for security: hard permission limits should be enforced in code, not merely requested in a prompt. A model instructed not to delete files may still attempt to do so; an agent without delete access cannot directly execute that operation through the restricted tool. This does not eliminate all other risks, but it limits the available action.

Some agents follow fixed workflows, others select actions dynamically, and some coordinate specialized sub-agents. Flexible behavior can help with unfamiliar tasks while making failures harder to predict and reproduce.

## Agentic AI vs generative AI vs automation

The three overlap. Many agentic systems use generative AI models and conventional software underneath.

| Question | Generative AI | Conventional automation | Agentic AI |
| --- | --- | --- | --- |
| Primary task | Produce content | Run a defined process | Pursue a goal using tools |
| Who chooses steps? | Usually the person | Designer defines them in advance | Model may choose at runtime |
| Typical problem | Plausible but wrong output | Unhandled exception or case | Wrong or unauthorized action |
| Need for tools | Optional | Common | Often central |

This is a simplified editorial comparison, not a fixed technical taxonomy.

For a predictable, repetitive process, ordinary automation may be cheaper, easier to test and easier to explain. Canada's [joint security guidance](https://www.cyber.gc.ca/en/guidance/careful-adoption-agentic-ai) recommends considering alternatives before introducing agent autonomy. The useful question is not whether an agent *can* do the work, but whether it improves the outcome enough to justify the extra complexity.

## An everyday example: rescheduling an appointment

This scenario is hypothetical; it does not describe a specific product.

Suppose you ask an assistant: "Move my dentist appointment to next week after 5 p.m., except Thursday."

A suitably connected agent could check your calendar, examine available slots, rule out clashes and propose two options. After you choose one, it could prepare the change for approval and then, if authorized, complete the booking.

The boundary matters. Suggesting a time is easy to undo. Confirming a booking might trigger a cancellation fee or other commitment. An agent should not treat permission to search as permission to commit.

The same distinction applies to online shopping. [AI shopping agents raise additional questions about seller selection, payments and fraud](/articles/ai-shopping-agents-scam-fraud-privacy-risks), especially when a recommendation becomes a transaction.

## A documented example: GitHub Copilot's cloud agent

GitHub publishes unusually specific documentation about one agent's operating limits. An authorized developer can assign its cloud coding agent a repository task. The agent can inspect files, prepare changes and open a pull request.

[GitHub's published security guidance](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/risks-and-mitigations) describes restrictions on who can trigger the agent, which branches it can modify and how pull requests are handled. The agent cannot approve or merge its own pull requests. Certain automated workflows triggered by agent-created changes require separate approval under the documented controls.

A related feature, [Agent Merge](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/watch-and-fix-pull-requests), can attempt to fix failing checks or merge conflicts. It does not itself enable auto-merge, which is a separate repository setting and remains subject to applicable requirements.

The lesson is not that the agent is guaranteed safe. These are the provider's documented controls, not independent evidence that every safeguard always holds. It is that an agent can perform substantial work while the software around it retains authority over the final integration.

A pull request that passes some tests can still contain an unexpected defect. A finished task is not automatically a correct one.

## How reliable are AI agents?

A demonstration establishes that a system succeeded once under selected conditions. Real use demands more consistent performance.

The peer-reviewed [τ-bench study presented at ICLR 2025](https://proceedings.iclr.cc/paper_files/paper/2025/hash/1b126cc38b8638e07bef37e7b2bb72bf-Abstract-Conference.html) evaluated agents interacting with simulated customers and software tools in retail and airline scenarios. The researchers compared the final state of the database with the intended outcome while assessing compliance with domain policies.

For GPT-4o with function calling, the paper reported single-attempt success rates of **61.2% in retail** and **35.2% in airline tasks**. It also introduced *pass^k*, a measure of consistent success across repeated trials. GPT-4o's retail *pass^8* was below 25%.

That is an outcome for a particular model and benchmark in the study's historical setting—not an estimate of all AI agents in November 2026. It illustrates why "can complete a task" and "can complete it reliably" are different claims.

### Why longer workflows can be fragile

For illustration, suppose a ten-step task has a 95% success probability at each step and that all failures are independent. The chance that every step succeeds is about **60%**. Real workflows do not follow such simple assumptions: errors can be correlated, some steps are recoverable and the severity of failures differs.

The arithmetic nevertheless shows why small per-step error rates can accumulate. A wrong customer account selected early could compromise every subsequent action.

### What to measure instead of demo speed

A practical evaluation should ask whether the agent reached the correct outcome, obeyed its permissions, succeeded repeatedly, needed significant human correction and recovered safely from errors.

Consider two hypothetical coding agents. One finishes in five minutes but needs twenty-five minutes of correction. Another takes fifteen minutes and needs two minutes of review. Measuring only execution time favors the first. Measuring the full workflow favors the second.

This is DECODISTA's editorial evaluation approach, informed by the benchmark, not the result of an independent DECODISTA product test. Representative tasks, repeated attempts and deliberate failure cases are needed before judging a deployment.

## The security problem: untrusted text becomes an instruction

A chatbot can be misled by malicious material. An agent can be misled **and then act** on it.

In a *prompt-injection attack*, an adversary hides instructions in content the agent reads—a webpage, email or repository file—hoping the system mistakes that untrusted content for an authorized command. A successful attack might cause data disclosure or misuse of an external tool.

### What the NIST-linked competition found

A [March 23, 2026 summary from NIST's Center for AI Standards and Innovation](https://www.nist.gov/blogs/caissi-research-blog/insights-ai-agent-security-large-scale-red-teaming-competition) described a public red-teaming competition hosted by Gray Swan, with participation from CAISI and the UK AI Security Institute.

It examined more than **250,000 attack attempts** from over **400 participants** against **13 frontier models** in agentic settings. At least one successful attack was found against every model tested. The related [research paper](https://arxiv.org/abs/2603.15714) was available as an arXiv preprint; peer-review status is not established here.

This contest involved motivated adversaries. It does not establish how often deployed agents are compromised or imply all models have the same weakness. It demonstrates why exposure to untrusted content must be treated as a security boundary.

### Excessive privileges and opaque actions

An agent that summarizes documents should not automatically be allowed to delete them. An assistant that prepares an email may not need access to every mailbox in an organization.

The [Canadian Centre for Cyber Security](https://www.cyber.gc.ca/en/guidance/careful-adoption-agentic-ai) warns about over-broad privileges, cascading failures and "confused deputy" situations in which an attacker steers a more privileged system into acting on the attacker's behalf.

Agents may also chain many tools or launch sub-tasks, making failures hard to reconstruct. Activity logs are valuable only if they allow operators to understand what happened.

## What meaningful human oversight requires

"Human in the loop" is not enough as a slogan. Three principles matter.

**Set approval boundaries outside the agent.** An agent should not decide for itself that a high-impact action no longer requires permission. Enforce authorization through application controls.

**Match authority to consequences.** Reading public information differs from deleting critical records, sharing sensitive data or transferring money. High-impact or hard-to-reverse operations need stronger controls.

**Expand cautiously.** The [joint Canadian-led security guidance](https://www.cyber.gc.ca/en/guidance/careful-adoption-agentic-ai) urges organizations to begin with **low-risk, non-sensitive tasks** and avoid broad or unrestricted access to sensitive data or critical systems. Review failures before widening permissions.

One editorial judgment follows: an approval step matters only if the reviewer can understand the proposed action and the evidence behind it. Vague confirmations that users click reflexively can provide the appearance of control without its substance.

## How widely are AI agents used?

An [April 2026 Stack Overflow pulse survey](https://stackoverflow.blog/2026/05/27/agents-on-a-leash-agentic-ai-remains-mostly-monitored-at-work/) of about 1,100 developers and working professionals found **59%** reported using AI agents at work, compared with **31%** in a 2025 survey. **63%** said they rarely or never let agents operate completely autonomously.

A separate [October 2026 Developer Survey](https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here) involved over 30,000 respondents and reported substantial daily use of AI coding assistants or agents among the relevant survey group.

These surveys differ in size, wording and population. Their findings indicate interest and use among Stack Overflow respondents, not a representative global adoption rate or proof of agent reliability.

## The bottom line

Agentic AI changes the question from "What can AI tell me?" to "What can AI do on my behalf—and who answers when it gets it wrong?"

The research points to a measured conclusion. Agents can perform useful work, but repeatable reliability and security require deliberate evaluation. The safest response is not unlimited autonomy: it is **bounded authority, enforced through software, with people retaining control of consequential actions**.

An agent worth trusting is one whose actions, limits and failures people can understand.
