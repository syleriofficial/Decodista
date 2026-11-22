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
  additionalSources?: BriefSource[];
  insight?: string;
  image?: { src: string; alt: string; width: number; height: number };
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
  topTakeaways?: string[];
  checklist?: string[];
  earlierAlerts?: string;
  cover?: { src: string; alt: string; width: number; height: number; socialSrc?: string };
}

export const weeklyBriefs: WeeklyBrief[] = [
  {
    "slug": "2026-11-22",
    "issueNumber": 4,
    "publishedDate": "2026-11-22",
    "periodStart": "2026-11-16",
    "periodEnd": "2026-11-22",
    "title": "Chrome's 204 Fixes, Fake Black Friday Stores and AI Threats",
    "cover": {
      "src": "/images/weekly/2026-11-22-cover.webp",
      "socialSrc": "/images/weekly/2026-11-22-og.webp",
      "alt": "Editorial illustration of browser security, online shopping scam warnings and connected AI threat indicators",
      "width": 1600,
      "height": 900
    },
    "standfirst": "Chrome 158's 204 security fixes, deceptive Black Friday storefronts, more autonomous AI attacks, a critical PHP flaw and business-payment fraud. Five sourced developments and practical next steps.",
    "topTakeaways": [
      "Update Chrome: the November 17 Stable release lists 204 security fixes, including six rated Critical.",
      "Check who is selling: fake Black Friday shops can imitate familiar brands and demand personal information at checkout.",
      "Treat AI-assisted intrusion research seriously without assuming every device is directly vulnerable."
    ],
    "items": [
      {
        "id": "chrome-158-204-security-fixes",
        "category": "Security",
        "headline": "Chrome 158 addresses 204 security issues, including six Critical vulnerabilities",
        "announcedDate": "2026-11-17",
        "whatChanged": "Google promoted Chrome 158 to the Stable channel for Windows, macOS and Linux on November 17, with 204 security fixes. Six entries are rated Critical, including memory-safety problems involving WebView, GPU, Media, GarbageCollection, ANGLE and WebAudio. Google said the release would roll out over the following days and weeks. The release note does not establish that all these flaws were being exploited.",
        "whyItMatters": "Browsers routinely process unfamiliar web content while users handle email, shopping and sensitive accounts. Using an outdated build can leave known vulnerabilities unpatched, but an update announcement does not mean every device has received the patch yet.",
        "whatToDo": "On desktop Chrome, open Settings > About Chrome, install the newest version offered for your system and relaunch. Update other Chromium-based browsers through their own vendors, and use official app-store updates on mobile.",
        "insight": "A browser is protected by the update it is actually running, not by the release announcement alone.",
        "source": {
          "label": "Google Chrome Stable release, November 17",
          "url": "https://chromereleases.googleblog.com/2026/11/stable-channel-update-for-desktop_01699533288.html"
        }
      },
      {
        "id": "black-friday-fake-retailer-stores",
        "image": {
          "src": "/images/weekly/2026-11-22-shopping-scams.webp",
          "alt": "Editorial illustration of an online shopping storefront with suspicious sale and checkout warnings",
          "width": 1200,
          "height": 675
        },
        "category": "Security",
        "headline": "Fake Black Friday stores mimic familiar brands as shopping season nears",
        "announcedDate": "2026-11-16",
        "whatChanged": "Check Point Research reported more than 4,000 newly registered domains associated with seasonal sales, retail brands and delivery companies during October and November 1–8, 2026; nearly one in five was classified as risky by its systems. Researchers documented a Walmart-impersonating Rollbacks storefront advertising steep discounts, including a supposed $49.99 iPad, and seeking shopper details. Separately, Bitdefender reported on November 19 that half of the Black Friday-themed spam emails in its October 30–November 10 sample were classified as scams. Those percentages refer to the researchers' datasets, not all shopping sites or emails.",
        "whyItMatters": "A polished storefront, brand colors and product reviews can make a fraudulent offer seem real. Scammers may collect personal information or payment details through a checkout page even when the product never existed.",
        "whatToDo": "Open a retailer's official website or app yourself rather than following unsolicited promotional links. Check the complete hostname and investigate unrealistic discounts or unexpected delivery charges. HTTPS alone does not establish that a store is legitimate.",
        "insight": "The most important signal is the identity of the seller and payment destination—not the realism of the storefront.",
        "source": {
          "label": "Check Point Research, November 16",
          "url": "https://blog.checkpoint.com/corporate/black-friday-cyber-crime-2026-attacks-on-retailers-surge-28-as-risky-domains-multiply/"
        },
        "additionalSources": [
          {
            "label": "Bitdefender Black Friday scam research, November 19",
            "url": "https://www.bitdefender.com/en-us/blog/hotforsecurity/black-friday-scam-report-2026"
          }
        ]
      },
      {
        "id": "google-ai-agent-cyber-threat-research",
        "image": {
          "src": "/images/weekly/2026-11-22-ai-cyber-threats.webp",
          "alt": "Editorial illustration of automated AI attack paths approaching a protected network of devices and servers",
          "width": 1200,
          "height": 675
        },
        "category": "AI",
        "headline": "Google documents greater use of autonomous AI frameworks in cyberattacks",
        "announcedDate": "2026-11-16",
        "whatChanged": "Google Threat Intelligence Group and Mandiant reported threat actors experimenting with and using multi-agent offensive frameworks including PentAGI, CAIRN and CyberStrikeAI. Their November 16 report describes automated reconnaissance, patch analysis and other intrusion steps. In one documented case, a threat actor customized PentAGI to scan organizations in Asia. These findings concern observed activity and experimentation; they are not evidence that AI can reliably compromise any computer on demand.",
        "whyItMatters": "Automating repeated reconnaissance and vulnerability work can reduce the time between discovery of a weakness and an exploitation attempt. Organizations may have less time to patch internet-exposed services, while individuals face familiar risks from convincing social engineering.",
        "whatToDo": "Use unique passwords and passkeys or multifactor authentication for important accounts. Organizations should prioritize timely updates, restricted access and monitoring of unusual activity.",
        "insight": "Faster offensive workflows make patch management and verification more important, not obsolete.",
        "source": {
          "label": "Google Threat Intelligence Group, November 16",
          "url": "https://cloud.google.com/blog/topics/threat-intelligence/agentic-threat-activity-crosses-a-significant-threshold"
        }
      },
      {
        "id": "phpaftershell-php-security",
        "category": "Security",
        "headline": "Critical phpAfterShell flaw prompts PHP updates and firewall protections",
        "announcedDate": "2026-11-19",
        "whatChanged": "Researchers disclosed phpAfterShell (CVE-2026-126714) on November 19. Under affected conditions, the flaw in PHP's default file-based session handler can contribute to remote code execution. It received a CVSS 4.0 score of 9.2, and the PHP project released fixes. Cloudflare subsequently described web application firewall detections for relevant attack patterns. A critical score does not mean every PHP installation is exploitable or that exploitation is confirmed everywhere.",
        "whyItMatters": "A server-side vulnerability can be serious for website operators, but exposure depends on versions, deployment conditions and whether relevant patches are installed. Some Linux vendors backport fixes without adopting the latest upstream version number.",
        "whatToDo": "Administrators should apply the appropriate PHP or distribution-maintained security update, check vendor advisories and restart affected services. Managed-hosting customers can confirm patch status with their provider. Firewall rules are additional protection, not a replacement for patching.",
        "insight": "Verify the security patch status of the actual deployed package; a version string alone can mislead.",
        "source": {
          "label": "Cloudflare analysis, November 20",
          "url": "https://blog.cloudflare.com/phpaftershell-waf-protection/"
        }
      },
      {
        "id": "cert-in-business-payment-fraud",
        "category": "Security",
        "headline": "CERT-In warns about attackers abusing legitimate business payment processes",
        "announcedDate": "2026-11-20",
        "whatChanged": "India's Computer Emergency Response Team published advisory CIAD-2026-0062 on November 20, warning about unauthorized financial transactions involving business payment and disbursement workflows. CERT-In said attackers targeted business records and approval processes, including at technology service providers and vendor-payout platforms, to make unauthorized transactions through legitimate systems. The advisory also discusses AI-driven offensive tooling.",
        "whyItMatters": "When an attacker changes records or approval rules, a payment can appear authorized to the system processing it. The risk involves business controls as well as phishing and password theft.",
        "whatToDo": "Verify unexpected payment-detail changes through a previously trusted channel, restrict access to financial records and require additional review for high-risk vendor and payout changes.",
        "insight": "Payment security depends on protecting the approval process, not just the final payment button.",
        "source": {
          "label": "CERT-In advisory CIAD-2026-0062, November 20",
          "url": "https://www.cert-in.org.in/s2cMainServlet?VLCODE=CIAD-2026-0062&pageid=PUBVLNOTES02"
        }
      }
    ],
    "relatedArticleSlugs": [
      "chrome-enhanced-protection-vs-standard-protection",
      "ai-shopping-agents-scam-fraud-privacy-risks",
      "what-is-agentic-ai",
      "recover-hacked-google-account-gmail"
    ],
    "checklist": [
      "Update your browser using its official update screen and relaunch it.",
      "Before a Black Friday purchase, verify the full retail domain and seller.",
      "Enable passkeys or strong multifactor authentication on important accounts."
    ]
  },

  {
    slug: "2026-11-16",
    issueNumber: 3,
    publishedDate: "2026-11-16",
    periodStart: "2026-11-11",
    periodEnd: "2026-11-15",
    title: "Chrome's 83 Security Fixes, Fake FTC Sites and AI Payments",
    standfirst: "Five source-verified updates from November 11–15: Chrome patches, fake government websites, Apple's Secure Exclaves, limited ChatGPT Wallet rollout, and exploited server vulnerabilities. Clear next steps without manufactured urgency.",
    cover: {
      src: "/images/weekly/2026-11-16-cover.webp",
      socialSrc: "/images/weekly/2026-11-16-og.webp",
      alt: "Editorial illustration of browser security, scam detection, device privacy and AI payment safeguards",
      width: 1600,
      height: 900
    },
    topTakeaways: [
      "Update Chrome: Google's November 11 release addressed 83 security vulnerabilities, including five rated Critical.",
      "Verify the real domain: fake government websites can mimic legitimate agencies and request personal information or money.",
      "Approve AI payments carefully: agent-assisted checkout still requires reviewing merchants, amounts and order details."
    ],
    items: [
      {
        id: "chrome-157-security-fixes",
        category: "Security",
        headline: "Chrome gets 83 security fixes, including five rated Critical",
        announcedDate: "2026-11-11",
        whatChanged: "Google updated Chrome's Stable channel on November 11 with 83 security fixes, including five Critical use-after-free bugs in ServiceWorker, CSS, Layout, Skia and Accessibility. The update brought Chrome 157 to 157.0.8103.78/.79 on Windows and macOS and 157.0.8103.78 on Linux. A limited early Stable rollout of Chrome 158 began on November 12; that did not mean everyone had version 158.",
        whyItMatters: "Browsers process unfamiliar web content, so security bugs can expose users to unwanted software behavior. An earlier November 9 Chrome fix addressed a vulnerability that Google said was being exploited. That is not evidence that the five Critical flaws fixed on November 11 were also actively exploited.",
        whatToDo: "Open Chrome > Settings > About Chrome, install the latest supported update offered for your device, and relaunch. Other Chromium-based browsers should be updated through their own vendors.",
        insight: "Patching is valuable when it actually reaches your device—not merely when an update makes headlines.",
        source: {
          label: "Google Chrome Stable release, November 11",
          url: "https://chromereleases.googleblog.com/2026/11/stable-channel-update-for-desktop_01744469280.html"
        }
      },
      {
        id: "fake-ftc-websites",
        category: "Security",
        headline: "FTC warns about websites impersonating the US government",
        announcedDate: "2026-11-12",
        whatChanged: "The US Federal Trade Commission warned that scammers were copying its name, logo and website design to create fake government pages. The FTC said it had demanded the removal of more than 30 impostor sites since its impersonation rule took effect in April 2024.",
        whyItMatters: "A fraudulent site can look professional and official while attempting to take money, personal details or account access. Legitimate FTC websites are on the ftc.gov domain, including official subdomains. A URL that merely contains the letters 'ftc' or an agency logo is not proof of authenticity.",
        whatToDo: "Go to a known official government address directly, examine the actual hostname before entering information, and independently confirm unusual requests. Do not transfer funds because an unexpected caller claims it is necessary to protect your money. US readers can report fraud at ReportFraud.ftc.gov.",
        insight: "Digital trust should be based on verified identity and context, not on how convincing a webpage looks.",
        source: {
          label: "FTC Consumer Alert, November 12",
          url: "https://consumer.ftc.gov/consumer-alerts/2026/11/how-spot-fake-ftc-websites-and-ftc-impersonators"
        }
      },
      {
        id: "apple-secure-exclaves",
        category: "Privacy",
        headline: "Apple explains Secure Exclaves for camera and microphone privacy",
        announcedDate: "2026-11-12",
        whatChanged: "Apple described Secure Exclaves, isolated computing environments intended to process sensitive camera and microphone data while limiting access from the main operating system. Apple cited HomeView person recognition and selected Siri features among uses of this architecture.",
        whyItMatters: "Ambient sensing features may recognize a face, voice or wake phrase without ordinary applications needing the full recording. Apple says its design isolates raw sensor data and limits which results can leave that protected environment. These are the company's architectural claims, not proof that every device or application offers identical protection.",
        whatToDo: "No emergency action is needed because of this announcement alone. Review which applications can use your camera and microphone, monitor sensor indicators, and evaluate privacy information before enabling new always-available AI features.",
        insight: "Privacy depends increasingly on limiting access by design rather than solely on user permission prompts.",
        source: {
          label: "Apple Security Research, November 12",
          url: "https://security.apple.com/blog/secure-exclaves/"
        }
      },
      {
        id: "chatgpt-wallet",
        category: "AI",
        headline: "ChatGPT Wallet begins a limited rollout for AI-agent purchases",
        announcedDate: "2026-11-13",
        whatChanged: "OpenAI introduced ChatGPT Wallet for agent-assisted purchases through dots. The rollout initially targets eligible ChatGPT Pro subscribers aged 18 or older in the United States with US billing addresses and eligible US-issued cards. Users review the merchant, items, total and selected card before authorizing a transaction. The payment network supplies substitute credentials rather than disclosing the actual card details to the agent or merchant.",
        whyItMatters: "AI-assisted shopping moves beyond comparing products into transaction execution. Tokenization can reduce exposure of payment credentials, but it does not guarantee that a merchant is trustworthy, an order is accepted or the purchase is correct. OpenAI describes broader pre-approved purchases as a future capability, not general availability today.",
        whatToDo: "If eligible, review each merchant, total, return policy and payment approval carefully. Confirm the order directly with the merchant afterward. Do not assume availability outside supported plans, cards or regions.",
        insight: "Reliable AI commerce should preserve clear human control of authorization and spending.",
        source: {
          label: "OpenAI Wallet announcement, November 13",
          url: "https://openai.com/index/introducing-chatgpt-wallet/"
        }
      },
      {
        id: "cisa-unrealircd-checkpoint",
        category: "Security",
        headline: "CISA flags exploited vulnerabilities in UnrealIRCd and Check Point products",
        announcedDate: "2026-11-13",
        whatChanged: "On November 13, CISA listed CVE-2026-114713 (UnrealIRCd) and CVE-2026-123039 (Check Point) in its Known Exploited Vulnerabilities catalog. The UnrealIRCd flaw can enable command injection with server authority on affected linked IRC networks. UnrealIRCd published version 6.2.7.1 and a hot-patch. Check Point researchers documented attackers chaining a separate initial-access weakness with the DynamicCLI privilege-escalation flaw.",
        whyItMatters: "These are product-specific server and network risks, not universal flaws affecting all home computers. The Check Point vulnerability requires relevant existing access; it should not be described as an unauthenticated remote takeover on its own. Confirmed exploitation makes the issues important for organizations deploying affected software.",
        whatToDo: "Administrators should inventory affected deployments, consult the vendor guidance, update UnrealIRCd to 6.2.7.1 or its verified official hot-patch, and install appropriate Check Point fixes or mitigations. Investigate suspected compromise. Users who do not operate these products generally have no product-specific action.",
        insight: "The right response to an exploited vulnerability begins by identifying whether you actually run the affected product.",
        source: {
          label: "CISA Known Exploited Vulnerabilities catalog",
          url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
        },
        additionalSources: [
          {
            label: "UnrealIRCd security release and hot-patch",
            url: "https://forums.unrealircd.org/viewtopic.php?t=9487"
          },
          {
            label: "Check Point Research: PHP2Shell attack chain",
            url: "https://research.checkpoint.com/2026/php2shell-exploitation-on-check-point-gateway/"
          }
        ]
      }
    ],
    relatedArticleSlugs: [
      "chrome-enhanced-protection-vs-standard-protection",
      "fake-tech-support-scams-remote-access-verification-code",
      "google-passkey-vs-2-step-verification"
    ],
    checklist: [
      "Update your browser using the official software update screen.",
      "Check the full domain before sharing information with an unfamiliar website.",
      "Review camera and microphone permissions on your devices.",
      "Verify merchants, totals and authorizations in any AI-assisted purchase.",
      "Enable a passkey or strong multifactor authentication for important accounts."
    ],
    earlierAlerts: "Two exploited vulnerabilities disclosed before this edition's November 11–15 reporting period are still worth checking: Chrome CVE-2026-125350 (November 9) and Microsoft Outlook CVE-2026-124194 (November 10). They are follow-up reminders, not counted among this issue's five new developments."
  },
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
