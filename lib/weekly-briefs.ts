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
    slug: "2026-11-11",
    issueNumber: 2,
    publishedDate: "2026-11-11",
    periodStart: "2026-11-02",
    periodEnd: "2026-11-10",
    title: "iPhone and Firefox Fixes, Instagram Teen Protections, and Gemini on Pixel",
    standfirst:
      "A catch-up edition covering five verified developments from November 2–10: software fixes, deceptive downloads, teen-account safeguards and Pixel AI features. Official sources and practical next steps.",
    items: [
      {
        id: "apple-ios-26-7-3-security",
        category: "Security",
        headline: "Apple releases iOS and iPadOS 26.7.3 with security fixes",
        announcedDate: "2026-11-09",
        whatChanged:
          "Apple's November 9 advisory lists iOS and iPadOS 26.7.3 fixes for eligible devices on the 26.x software branch. It documents issues affecting components including AirPlay, Bluetooth and data processing, with separate details about the affected devices and vulnerability identifiers.",
        whyItMatters:
          "The exact update available depends on the device and its installed operating-system branch. An advisory describes potential security impact, not proof that each issue has been exploited against users.",
        whatToDo:
          "Open Settings > General > Software Update, back up important data and install the supported update offered for your device. Do not try to install a version intended for a different OS branch.",
        source: {
          label: "Apple security content for iOS and iPadOS 26.7.3, November 9",
          url: "https://support.apple.com/en-us/149716",
        },
      },
      {
        id: "firefox-160-security",
        category: "Security",
        headline: "Mozilla fixes high-impact vulnerabilities in Firefox 160",
        announcedDate: "2026-11-10",
        whatChanged:
          "Mozilla published a November 10 advisory for Firefox 160 detailing fixes for multiple high-impact vulnerabilities, including sandbox-escape, memory-safety and privilege-escalation issues. Its separate ESR advisories apply to supported enterprise channels.",
        whyItMatters:
          "Browsers process content from unfamiliar websites, so staying on a supported release matters. A vulnerability's high impact rating does not by itself establish widespread real-world exploitation.",
        whatToDo:
          "Check Firefox's About Firefox screen and install the current update offered for your platform. Firefox ESR users should follow the appropriate ESR channel instead of assuming the standard version number applies.",
        source: {
          label: "Mozilla security advisory MFSA 2026-125, November 10",
          url: "https://www.mozilla.org/en-US/security/advisories/mfsa2026-125/",
        },
      },
      {
        id: "fake-download-installers",
        category: "Security",
        headline: "Microsoft documents fake downloads that silently add unwanted software",
        announcedDate: "2026-11-03",
        whatChanged:
          "Microsoft Threat Intelligence traced a campaign using deceptive installers advertised as cracked software, free games, activators and unofficial utilities. Depending on the installation, the bundles could quietly add tools that route third-party internet traffic, use the computer for distributed computing, or show unwanted software offers.",
        whyItMatters:
          "A seemingly free download can create security and privacy risks beyond the app a person meant to install. Microsoft described observed campaign behavior; it did not claim that every unofficial download is part of this operation.",
        whatToDo:
          "Get software from its official publisher, avoid cracks and unknown installer sites, and leave Windows reputation-based protection enabled. If you ran a suspicious installer, scan the device and review recently installed apps and unexpected scheduled tasks.",
        source: {
          label: "Microsoft Threat Intelligence research, November 3",
          url: "https://www.microsoft.com/en-us/security/blog/2026/11/03/fake-download-campaign-uses-trojanized-installers-deliver-monetization-payloads/",
        },
      },
      {
        id: "instagram-teen-age-estimation",
        category: "Privacy",
        headline: "Instagram expands AI age estimation for Teen Account protections",
        announcedDate: "2026-11-09",
        whatChanged:
          "Meta says it is expanding AI-assisted age estimation globally on Instagram to identify accounts that may belong to teenagers, including those with an adult birth date, and apply age-appropriate Teen Account safeguards. The company describes Facebook and Threads expansion on separate timelines.",
        whyItMatters:
          "Age inference can affect an account's communication and content protections even when the age entered at signup differs. Meta's announcement is a rollout statement, not evidence that every account has already been evaluated or that the system is always correct.",
        whatToDo:
          "Families can review Teen Account settings and age-related notices directly in Instagram. If an age classification appears incorrect, use the app's official account-review or age-confirmation options rather than sharing identity documents with strangers.",
        source: {
          label: "Meta announcement on global teen protections, November 9",
          url: "https://about.fb.com/news/2026/11/expanding-teen-account-protections-to-teens-around-the-world/",
        },
      },
      {
        id: "pixel-gemini-intelligence-november",
        category: "AI",
        headline: "Google expands Gemini Intelligence features in its November Pixel Drop",
        announcedDate: "2026-11-10",
        whatChanged:
          "Google announced new and expanded Pixel features, including Gemini Intelligence on eligible Pixel 10 devices, an improved voice-typing tool called Rambler and AI-assisted multi-step tasks. Google specifically lists multi-step task support in Japan, the UK and India, with availability restrictions depending on device, region, language and setup.",
        whyItMatters:
          "Features that work with messages, suggestions and everyday tasks can feel convenient, but Google's announcement does not mean all Pixel models or countries receive every capability immediately. The rollout is phased over several weeks.",
        whatToDo:
          "If your Pixel is eligible, check the device's update and feature settings, review any personalization permissions and verify proposed AI actions before approving them. Do not assume a feature is available until it appears on your device.",
        source: {
          label: "Google November Pixel Drop announcement, November 10",
          url: "https://blog.google/products-and-platforms/devices/pixel/november-2026-pixel-drop/",
        },
      },
    ],
    relatedArticleSlugs: [
      "ios-26-7-1-cve-2026-86950-security-update",
      "chrome-enhanced-protection-vs-standard-protection",
      "fake-tech-support-scams-remote-access-verification-code",
    ],
  },
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
