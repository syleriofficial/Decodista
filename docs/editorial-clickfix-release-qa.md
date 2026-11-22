# DECODISTA — ClickFix Security Guide Release Record

**Article:** [Fake CAPTCHA Scams: How ClickFix Works and How to Stay Safe](../content/articles/fake-captcha-scams-clickfix-malware.md)  
**Intended production URL:** https://decodista.com/articles/fake-captcha-scams-clickfix-malware  
**Primary category:** Security | **Content type:** Explainer  
**Original publication date:** 2026-11-23 | **Information checked:** 2026-11-23  
**PR:** https://github.com/syleriofficial/Decodista/pull/125

## Original images: uploaded and verified

All three 1600×900 WebP files were added to the PR branch using GitHub's blob and tree APIs and their file contents verified by the repository's draft/image QA on the actual commit. Examples depict reserved \`verification.example\`, no malicious executable commands, and no real website allegedly distributing malware.

| Asset | Bytes | SHA-256 |
|---|---:|---|
| \`public/images/uploads/fake-captcha-scams-clickfix-malware.webp\` | 68,496 | \`d14f49411eae5efd6f0e59b3d180cc257f3a3f40a760d19109c2a55cfa5bf06e\` |
| \`public/images/uploads/clickfix-real-vs-fake-captcha.webp\` | 62,406 | \`9073e0a77d97cf47cfdaeaa3d82944e1dd47060f446b73a9064251ffe00a16cd\` |
| \`public/images/uploads/clickfix-recovery-decision-flowchart.webp\` | 71,754 | \`7d114976c0da23f77d19fc7bbfc560427051a010a4ed4020ec6b608c60ca4211\` |

Hero alt: Conceptual laptop showing a fictional verification prompt with an unusual command request. Inline comparison alt: Legitimate browser verification versus suspicious command request. Decision aid alt: Separate paths for viewed, clicked and executed states.

## Technical release evidence

- **Release checks: PASS**, [run 45081844158](https://github.com/syleriofficial/Decodista/actions/runs/45081844158), covering content validation, tests, lint, type checks and build.
- **Draft and image exact-hash checks: 20/20 PASS**, [run 45081844186](https://github.com/syleriofficial/Decodista/actions/runs/45081844186); reported \`assetsComplete: true\`. Publication readiness is tracked separately.
- **Four-viewport local browser QA: 4/4 PASS**, [run 45081844184](https://github.com/syleriofficial/Decodista/actions/runs/45081844184), including 1440x900 desktop, 768x1024 tablet, 390x844 mobile light and 320x720 small mobile dark. Verified article H1, Security category, table of contents, FAQ, canonical, Article/Breadcrumb JSON-LD, internal links, descriptive alt text, all three image decodes, zero page errors and no horizontal overflow. Captured screenshots were inspected.
- Source reporting attributes Windows TerminalFix and macOS ClickFix to separate Microsoft research, and ROMULUS to Blackpoint Cyber. Describes observed activity separately from possible malware capabilities. Microsoft's primary sources and New Zealand's September warning were manually opened. Automated access to Blackpoint was restricted (HTTP 403), and Apple Support rate-limited the crawler (HTTP 429), so these should not be described as comprehensively human browser-tested.

## Editorial scope

This is original consumer-first explanation and analysis based on third-party research, not firsthand malware testing. Risk differentiates viewing, clicking, copying, pasting and executing. Windows and macOS recovery paths are distinct, and mobile phishing is not misrepresented as the same execution mechanism. Designed for a global English audience.

## Release control

Premerge QA is complete on article/assets. A documentation tidy-up can cause a fresh Release check; confirm it passes on the **current PR head SHA** before merging. The user's request to **complete the workflow** authorizes proceeding if checks remain green; keep the required current SHA/approval record in the PR discussion. After GitHub merge, confirm Cloudflare deployed the matching commit, Production Verification and Lighthouse succeeded, and the actual article/images return HTTP 200. **Do not equate GitHub merge with live deployment.**
