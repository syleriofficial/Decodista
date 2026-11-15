# DECODISTA: Dated Editorial Inventory and Review Queue

**Snapshot:** November 15, 2026; GitHub `main` at `2d1b540db1db976db3f837d94971886efcb1ac86`. This is a **source-file and metadata inventory**, not a claim that every third-party source was independently tested today.

## What the inventory established

| Check | Result | Interpretation |
| --- | ---: | --- |
| Published Markdown articles | 26 | `content/articles/*.md` on the snapshot commit |
| Articles with at least one contextual article link in the body | 26 / 26 | Counted both root-relative and full `https://decodista.com/articles/...` forms; quality and relevance still need human review |
| Articles with `informationCheckedAt: 2026-11-15` | 8 | These recently updated articles were reviewed in separate editorial PRs; verification metadata is not an automatic proof that facts remain current |
| Articles with earlier `informationCheckedAt` | 18 | These need a risk-based future review queue, not automatic rewriting |
| Missing `updatedAt` on an otherwise unedited article | Not inherently a defect | Do not invent an update date solely to make a page look fresher |

The prior informal audit underestimated internal links because the old validator counted `/articles/...` but not fully qualified DECODISTA article URLs. This PR fixes that **structural** blind spot and adds tests. It does not attempt to fetch live external URLs, determine claim truth automatically or silently rewrite published content.

## Reviewed on November 15 — existing content refreshes

These eight have a November 15 `informationCheckedAt` date on `main`:

- `ai-shopping-agents-scam-fraud-privacy-risks`
- `chatgpt-memory-vs-chat-history-model-training`
- `chrome-enhanced-protection-vs-standard-protection`
- `delete-chatgpt-chat-uploaded-files-library`
- `ios-26-7-1-cve-2026-86950-security-update`
- `meta-muse-privacy-access-memory-ai-training`
- `openai-agent-leak-53-chatgpt-user-images`
- `samsung-one-ui-9-rollout-features-eligible-galaxy-phones`

These dates describe past review work, **not** independent confirmation that providers cannot issue another change tomorrow.

## Remaining review queue (18 articles)

Priority reflects risk of changed external facts or user harm, **not** a finding of an error. The listed date is the current `informationCheckedAt` on the snapshot.

### P1 — review high-change or potentially destructive advice first (6)

| Article slug | Last recorded check | Primary review question |
| --- | --- | --- |
| `siri-ai-privacy-ios-27-apple-intelligence-data` | 2026-09-26 | Did current Siri/AI integrations, model availability, consent or data handling change? |
| `pixel-scam-detection-chat-gboard-privacy-2026` | 2026-09-27 | Are device/region availability, processing and scam feature limits still correct? |
| `gemini-temporary-chat-vs-keep-activity-off` | 2026-09-16 | Do temporary retention and Keep Activity differences still match Google's live help? |
| `remove-third-party-google-access-without-losing-login` | 2026-09-16 | Have third-party app permission, login and disconnect flows changed? |
| `does-icloud-backup-include-photos` | 2026-09-18 | Are current iCloud Photos/Backup and recovery instructions still loss-safe? |
| `google-photos-android-undo-backup-keep-phone-photos` | 2026-09-17 | Does the documented deletion/undo sequence remain valid for the current app? |

### P2 — verify other account, photo, recovery and security guides (8)

| Article slug | Last recorded check | Primary review question |
| --- | --- | --- |
| `gemini-memory-turn-off-delete-past-chats` | 2026-10-05 | Current Memory, app connection and retention controls |
| `google-photos-free-up-space-what-it-deletes` | 2026-09-23 | Which local and cloud copies are affected |
| `google-photos-locked-folder-backup-lost-phone` | 2026-10-06 | Backup and device-loss safety details |
| `transfer-google-photos-another-account` | 2026-10-11 | Partner Sharing, quotas and destination retention |
| `turn-off-icloud-photos-without-losing-photos-iphone` | 2026-10-05 | Local-original/download and account-wide deletion distinction |
| `google-authenticator-new-phone-codes-missing` | 2026-09-18 | Sync, QR transfer, app menus and recovery limitations |
| `google-passkey-vs-2-step-verification` | 2026-10-06 | Current passkey-first behavior and recovery eligibility |
| `unknown-device-google-account-session` | 2026-10-09 | Device-session explanations and account security actions |

### P3 — periodic evergreen / recent-change recheck (4)

| Article slug | Last recorded check | Primary review question |
| --- | --- | --- |
| `fake-tech-support-scams-remote-access-verification-code` | 2026-10-03 | Recent scam patterns and official reporting paths |
| `gmail-not-receiving-emails-google-storage-full` | 2026-11-11 | Storage quota and Gmail troubleshooting details |
| `iphone-storage-full-icloud-has-space` | 2026-11-11 | Device-vs-iCloud storage guidance |
| `whatsapp-two-step-verification-password` | 2026-11-10 | Current eligibility and secure migration advice |

Several P2/P3 guides were sampled against official product documentation during earlier passes and required no change at that time. Their older `informationCheckedAt` should remain unchanged until each article receives its own **complete, dated** verification pass.

## Workflow to clear an item

1. Open the currently published article and the most recent official documentation, recording source dates and target geography/platform.
2. Check every **actionable** instruction (especially deletion, security, payments, subscriptions and privacy), not just the opening paragraph. Check tables, FAQs and takeaways for consistency.
3. Record a clear **PASS / factual correction needed / awaiting confirmation** decision. A PASS without substantive edits needs no new PR or artificial `updatedAt`.
4. If correcting, use a small Draft PR for the actual article changes, keep its slug, cite new primary sources and update `informationCheckedAt` only after full verification.
5. Require current-head release checks, explicit approval, Cloudflare matching-build confirmation, Production QA and Mobile Lighthouse before calling it published.

## Separate documentation / navigation debt

Some older repository documents discuss the Weekly Brief and navigation behavior. Before promoting any such feature, compare current site implementation, the owner's approved navigation and production behavior. **Do not re-enable a removed feature or write new articles as part of this editorial-audit PR.**

## Important limits

A valid internal link can still be contextually poor. A valid HTTPS URL can return an error, redirect to unrelated content or have outdated facts. Neither content validation nor automated release checks can determine whether a company claim is true or whether an image is semantically appropriate. Use human source checks in `docs/editorial-standards.md`.
