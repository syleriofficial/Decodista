/** Human-reviewed weekly editorial digest. New issues are added explicitly, not generated on a timer. */
export type BriefCategory = "Security" | "Privacy" | "AI";

export interface BriefSource {
  label: string;
  url: string;
}

export interface BriefItem {
  id: string;
  category: BriefCategory;
  headline: string;
  announcedDate: string;
  whatChanged: string;
  whyItMatters: string;
  whatToDo: string;
  source: BriefSource;
}

export interface WeeklyBrief {
  slug: string;
  issueNumber: number;
  publishedDate: string;
  periodStart: string;
  periodEnd: string;
  title: string;
  standfirst: string;
  items: BriefItem[];
  relatedArticleSlugs: string[];
}

export const weeklyBriefs: WeeklyBrief[] = [
  {
    slug: "2026-11-01",
    issueNumber: 1,
    publishedDate: "2026-11-01",
    periodStart: "2026-10-26",
    periodEnd: "2026-11-01",
    title: "Chrome's Gmail Autofill, Apple and Firefox Fixes, and AI Privacy Choices",
    standfirst:
      "Five verified developments from October 26–November 1, with the practical takeaway and an official source for each. No manufactured urgency.",
    items: [
      {
        id: "chrome-enhanced-autofill",
        category: "Privacy",
        headline: "Chrome begins rolling out Gmail-based enhanced autofill",
        announcedDate: "2026-10-28",
        whatChanged:
          "Google says enhanced autofill can suggest details from Gmail, including order numbers and travel bookings, through Gemini with Personal Intelligence. The rollout is beginning in the United States on desktop, Android and iOS for eligible Gemini in Chrome users with Personal Intelligence enabled.",
        whyItMatters:
          "A convenience feature may also change which personal information is available while filling in forms. Google says controls remain in Chrome settings. This is a limited rollout, not a feature every Chrome user already has.",
        whatToDo:
          "If the feature appears, review enhanced autofill and connected-information permissions before deciding whether to use it. Do not assume it is enabled or available in your region.",
        source: {
          label: "Google Chrome announcement, October 28",
          url: "https://blog.google/products-and-platforms/products/chrome/enhanced-autofill-gmail/",
        },
      },
      {
        id: "apple-october-security",
        category: "Security",
        headline: "Apple publishes October 26 updates across several OS versions",
        announcedDate: "2026-10-26",
        whatChanged:
          "Apple lists iOS and iPadOS 27.2, separate iOS and iPadOS 26.7.2 releases, and security updates for compatible Macs and other devices. Apple publishes release-specific security information and device eligibility.",
        whyItMatters:
          "The update available to you depends on your device and operating-system branch. A headline about iOS 27.2 does not mean every supported device should install that exact version.",
        whatToDo:
          "Check the built-in Software Update screen for your device, read the offered version, and make a backup before updating. Follow Apple's release and compatibility documentation rather than trying to downgrade.",
        source: {
          label: "Apple security releases, updated October 26",
          url: "https://support.apple.com/en-us/100100",
        },
      },
      {
        id: "firefox-159-security",
        category: "Security",
        headline: "Firefox 159 addresses high-impact security vulnerabilities",
        announcedDate: "2026-10-27",
        whatChanged:
          "Mozilla's October 27 advisory documents security fixes in Firefox 159, including same-origin policy bypass and sandbox-escape issues. It lists affected components and individual vulnerability identifiers.",
        whyItMatters:
          "A browser is exposed to untrusted web content every day. Mozilla's advisory supports installing the fixed release; it does not establish that every listed flaw has been exploited against ordinary users.",
        whatToDo:
          "If you use Firefox, check for an official browser update and install the current release offered for your device. Enterprise and ESR users should follow their applicable supported update channel.",
        source: {
          label: "Mozilla security advisory MFSA 2026-118, October 27",
          url: "https://www.mozilla.org/en-US/security/advisories/mfsa2026-118/",
        },
      },
      {
        id: "ai-training-signal",
        category: "Privacy",
        headline: "OpenAI announces support for a shared AI-training preference signal",
        announcedDate: "2026-10-30",
        whatChanged:
          "OpenAI says it plans to honor a common robots.txt signal that will let website owners express generative-AI training preferences to participating providers. It says implementation is planned over the coming months.",
        whyItMatters:
          "Today, publishers often manage provider-specific crawler rules. A shared preference could make this simpler, but the announcement is not proof the new signal is already implemented or supported by every provider.",
        whatToDo:
          "If you run a website, keep using existing documented crawler controls where appropriate and wait for implementation details before relying on the new shared signal.",
        source: {
          label: "OpenAI announcement, October 30",
          url: "https://openai.com/index/helping-websites-express-ai-training-preferences/",
        },
      },
      {
        id: "openai-model-spec",
        category: "AI",
        headline: "OpenAI revises its public Model Spec around five values",
        announcedDate: "2026-10-29",
        whatChanged:
          "OpenAI reorganized its public model-behavior guidance around faithfulness to human intent, harm minimization, honesty and transparency, human agency, and care. It also revised guidance about context and oversight.",
        whyItMatters:
          "The specification describes intended model behavior and the trade-offs behind it. OpenAI says its models do not yet fully reflect every part of the updated guidance, so the document should not be treated as a guarantee about a specific answer.",
        whatToDo:
          "No settings change is required. If you use AI for important decisions, continue checking its claims and use the published specification to understand the provider's stated expectations.",
        source: {
          label: "OpenAI Model Spec update, October 29",
          url: "https://openai.com/index/updated-model-spec/",
        },
      },
    ],
    relatedArticleSlugs: [
      "chrome-enhanced-protection-vs-standard-protection",
      "does-icloud-backup-include-photos",
      "chatgpt-memory-vs-chat-history-model-training",
    ],
  },
];

export const getWeeklyBrief = (slug: string): WeeklyBrief | undefined =>
  weeklyBriefs.find((issue) => issue.slug === slug);
