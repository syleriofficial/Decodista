export interface InfoPage {
  title: string;
  eyebrow: string;
  description: string;
  updated?: string;
  sections: {
    title: string;
    paragraphs: string[];
    bullets?: string[];
    links?: { href: string; label: string }[];
  }[];
}

export const infoPages: Record<string, InfoPage> = {
  about: {
    title: "About DECODISTA",
    eyebrow: "Technology, Decoded.",
    description: "DECODISTA is a consumer-technology publication built to make everyday technology easier to understand.",
    sections: [
      {
        title: "What we do",
        paragraphs: [
          "DECODISTA publishes clear explanations and practical guides for the technology people use every day. The focus is not only what a product or setting does, but what it means for a reader making a real decision.",
        ],
        bullets: [
          "Understand artificial intelligence and emerging technology",
          "Fix account, privacy, backup and device problems",
          "Make informed choices without manufactured urgency",
          "Read globally accessible English with necessary terms explained",
        ],
      },
      {
        title: "Our editorial position",
        paragraphs: [
          "DECODISTA prefers useful context to hype. It distinguishes documentation-based explanation from hands-on testing and does not present a review unless a genuine evaluation has taken place.",
          "Published work currently uses the DECODISTA Editorial byline. The byline describes publication-level responsibility; it does not imply a large newsroom or unnamed specialist credentials.",
        ],
        links: [
          { href: "/editorial-policy", label: "Editorial Standards" },
          { href: "/how-we-work", label: "How We Work" },
          { href: "/editorial-team", label: "DECODISTA Editorial" },
        ],
      },
    ],
  },
  contact: {
    title: "Contact",
    eyebrow: "Reach DECODISTA",
    description: "Current contact availability and guidance for corrections, privacy and security-sensitive information.",
    sections: [
      {
        title: "Current contact status",
        paragraphs: [
          "DECODISTA does not currently operate a verified public submission channel. This page does not collect, transmit or store messages, and there is no form to submit.",
          "A contact workflow will be enabled only after server-side delivery, abuse protection, rate limiting and end-to-end delivery have been configured and tested. Until then, this page records that limitation rather than suggesting that a message can be delivered.",
        ],
        links: [
          { href: "/corrections", label: "Corrections policy" },
          { href: "/privacy-policy", label: "Privacy Policy" },
        ],
      },
      {
        title: "Security note",
        paragraphs: [
          "Do not send secrets or material that would let someone enter, recover or take control of an account. DECODISTA will never need them to assess an editorial question or correction.",
        ],
        bullets: [
          "Passwords, passkeys, PINs, recovery keys or recovery phrases",
          "One-time codes, backup codes or authenticator setup keys",
          "QR codes, session tokens, API keys or private keys",
          "Payment-card details, banking credentials, government-identity data or other account secrets",
        ],
      },
    ],
  },
  "editorial-policy": {
    title: "Editorial Standards",
    eyebrow: "Accuracy, clarity, independence",
    description: "The standards applied to DECODISTA explanations, guides and future evaluation work.",
    sections: [
      {
        title: "Accuracy and sourcing",
        paragraphs: [
          "DECODISTA aims to distinguish documented facts, practical recommendations, analysis and uncertainty. Primary or official sources are preferred for product behaviour, settings and policy claims.",
        ],
        bullets: [
          "Link important claims to the most relevant source available",
          "State when information was checked where timing matters",
          "Name meaningful limitations and documentation conflicts",
          "Avoid sensational headlines and unsupported certainty",
        ],
      },
      {
        title: "Testing and reviews",
        paragraphs: [
          "A documentation-based article is not described as hands-on testing. Reviews remain outside DECODISTA’s active publishing model until products or services can be evaluated directly with a disclosed method.",
          "Any future commercial relationship, supplied product, sponsorship or affiliate link should be disclosed clearly and should not determine an editorial conclusion.",
        ],
      },
      {
        title: "Corrections and updates",
        paragraphs: [
          "Material factual errors should be corrected promptly. Significant corrections should be explained on the affected page; ordinary maintenance changes may be reflected in the updated date when they materially change the article.",
        ],
        links: [
          { href: "/corrections", label: "Corrections policy" },
          { href: "/how-we-work", label: "How We Work" },
        ],
      },
    ],
  },
  "how-we-work": {
    title: "How We Work",
    eyebrow: "From source to explanation",
    description: "How DECODISTA researches, labels and maintains consumer-technology coverage.",
    sections: [
      {
        title: "Start with the reader’s decision",
        paragraphs: [
          "Coverage begins with a practical question: what does a reader need to understand, verify or do safely? Articles are structured to provide a direct answer before the deeper explanation.",
        ],
      },
      {
        title: "Prefer primary sources",
        paragraphs: [
          "Official product documentation, support pages, policies and first-party announcements are preferred for claims about settings and service behaviour. Sources are linked near the relevant explanation where practical.",
          "Relevant independent reporting can supplement primary evidence, especially for ongoing events and claims that require external context.",
          "When documentation is unclear or inconsistent, the article should say so rather than resolving the ambiguity by guesswork.",
        ],
      },
      {
        title: "Separate documentation from testing",
        paragraphs: [
          "A guide based on documentation is labelled and written as documentation-based reporting. DECODISTA does not claim to have changed an account, transferred data, tested hardware or captured a screenshot unless that work was actually performed and documented.",
        ],
      },
      {
        title: "Maintain and correct",
        paragraphs: [
          "Information-check dates record when time-sensitive documentation was reviewed. Updated dates are used when published material changes meaningfully. Errors are handled under the Corrections policy.",
        ],
        links: [
          { href: "/editorial-policy", label: "Editorial Standards" },
          { href: "/corrections", label: "Corrections policy" },
          { href: "/ai-policy", label: "AI Policy" },
        ],
      },
    ],
  },
  corrections: {
    title: "Corrections",
    eyebrow: "Getting the record right",
    description: "How DECODISTA handles factual errors, clarifications and material updates.",
    sections: [
      {
        title: "What is corrected",
        paragraphs: [
          "Factual errors, misleading wording, broken source attribution and instructions made unsafe by a product change should be reviewed and corrected. Differences of opinion are not treated as factual errors, but unclear distinctions may warrant clarification.",
        ],
      },
      {
        title: "How changes are shown",
        paragraphs: [
          "A material correction should be noted on the affected article with enough context to understand what changed. Substantive maintenance may update the article’s modified date. Typographical changes that do not alter meaning do not require a correction note.",
        ],
      },
      {
        title: "Submitting a correction",
        paragraphs: [
          "The Contact page records whether a verified submission route is available. It does not currently accept messages, and no correction should be assumed delivered through this website.",
          "When submissions become available, DECODISTA will review credible requests and correct material errors where appropriate. A submission will not guarantee that a change is made.",
        ],
        bullets: [
          "The URL of the affected article",
          "The exact statement or instruction that may be wrong",
          "A concise explanation of the issue",
          "A reliable primary or supporting source, when available",
        ],
        links: [{ href: "/contact", label: "Contact status" }],
      },
    ],
  },
  "editorial-team": {
    title: "DECODISTA Editorial",
    eyebrow: "Editorial profile",
    description: "The publication-level byline used for DECODISTA’s researched explanations and guides.",
    sections: [
      {
        title: "What the byline means",
        paragraphs: [
          "DECODISTA Editorial identifies work published under the publication’s editorial process. It does not represent a list of invented staff members, credentials or testing facilities.",
          "Articles carrying this byline should make their sourcing, verification date, limitations and testing status clear within the page when those details matter.",
        ],
      },
      {
        title: "Editorial approach",
        paragraphs: [
          "The work prioritises primary sources, relevant independent reporting, practical consequences and careful safety language. Gaps and uncertainty should be stated instead of filled with inference.",
          "No article should claim first-hand use, original testing or specialist credentials unless those claims can be supported and disclosed. Information-check dates are shown where timing matters, and material mistakes are handled under the Corrections policy.",
          "Automated tools may assist with production under the publication’s AI Policy, but DECODISTA Editorial remains responsible for what is published.",
        ],
        links: [
          { href: "/how-we-work", label: "How We Work" },
          { href: "/editorial-policy", label: "Editorial Standards" },
          { href: "/corrections", label: "Corrections policy" },
          { href: "/ai-policy", label: "AI Policy" },
        ],
      },
    ],
  },
  "ai-policy": {
    title: "AI Policy",
    eyebrow: "Responsible assistance",
    description: "How automated tools may support DECODISTA without replacing editorial responsibility.",
    sections: [
      {
        title: "Where tools may assist",
        paragraphs: [
          "Automated tools may assist with research organisation, structure, formatting, metadata, code and original illustration production. Their output is not treated as evidence or as a substitute for checking the cited source.",
        ],
      },
      {
        title: "Editorial responsibility",
        paragraphs: [
          "DECODISTA Editorial remains responsible for what is published. Unsupported facts, fabricated quotations, invented testing and false credentials are not acceptable uses of automation.",
        ],
      },
      {
        title: "Images and testing",
        paragraphs: [
          "Original editorial illustrations may be created with generative tools and should not imitate protected product interfaces or imply hands-on testing. Documentation-based guides must not be presented as device or account testing.",
        ],
        links: [
          { href: "/editorial-policy", label: "Editorial Standards" },
          { href: "/how-we-work", label: "How We Work" },
        ],
      },
    ],
  },
  "privacy-policy": {
    title: "Privacy Policy",
    eyebrow: "Reader privacy",
    updated: "20 September 2026",
    description: "How DECODISTA handles local preferences, optional analytics and standard hosting data.",
    sections: [
      {
        title: "Information collected",
        paragraphs: [
          "DECODISTA does not operate a newsletter signup or contact form and does not intentionally collect names, email addresses or form submissions. Theme and analytics preferences are stored locally on your device.",
        ],
      },
      {
        title: "Hosting and analytics",
        paragraphs: [
          "Cloudflare hosts DECODISTA and may process standard request information, such as IP addresses and user-agent data, to deliver and protect the website.",
          "With your permission, DECODISTA loads Google Analytics to measure page views and site interaction. Advertising storage, advertising user data, advertising personalisation, Google signals and ad-personalisation signals remain disabled in DECODISTA’s implementation.",
        ],
      },
      {
        title: "Your choices",
        paragraphs: [
          "Analytics is off by default and its tag is not loaded unless you accept. You can decline or reopen Privacy choices in the footer. Withdrawing consent prevents future analytics collection from that browser but does not delete information already processed before withdrawal.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms",
    eyebrow: "Using DECODISTA",
    updated: "20 September 2026",
    description: "Basic terms governing access to DECODISTA’s informational technology coverage.",
    sections: [
      {
        title: "Informational purpose",
        paragraphs: [
          "DECODISTA content is provided for general information and education. It is not a substitute for professional legal, medical, financial or security advice, and product interfaces or policies may change after publication.",
        ],
      },
      {
        title: "Use of the website",
        paragraphs: [
          "You may read and link to publicly available pages for lawful purposes. Do not interfere with the website, attempt unauthorised access or misrepresent DECODISTA content or branding as your own.",
        ],
      },
      {
        title: "External services",
        paragraphs: [
          "Articles may link to third-party documentation and services. Those destinations control their own content, availability and privacy practices. A source link is not an endorsement of every part of a third-party service.",
        ],
      },
      {
        title: "No fabricated evaluation claims",
        paragraphs: [
          "DECODISTA distinguishes researched explanation from hands-on testing. The absence of a testing claim means readers should not infer that a product, account change or recovery process was personally tested.",
        ],
      },
    ],
  },
};
