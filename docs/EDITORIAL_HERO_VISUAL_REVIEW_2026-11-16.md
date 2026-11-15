# DECODISTA — Human visual review of 26 published Hero Images
**Reviewed:** November 16, 2026 · **Scope:** every Hero WebP file referenced by the 26 published Markdown articles in `content/articles/`.

## Method and limits
Each original image was retrieved directly from the linked GitHub repository and visually inspected alongside the corresponding article subject and `heroImageAlt` text. This is a **visual semantics** review, not a check of image provenance, copyright ownership, brand authorization, screenshots from real interfaces, or underlying article claims. No image generation, asset deletion or URL changes were made.

**Result:** 23 images have reasonable conceptual alignment; 3 need replacement or improved compositional clarity. Separate editorial disclosures and alt corrections were prepared in the linked PR. **Do not substitute these images for real product instructions or documentary evidence.**

## Priority editorial fixes

| Priority | Article | Observed visual concern | Safe near-term action | Ideal replacement |
| --- | --- | --- | --- | --- |
| P1 | `openai-agent-leak-53-chatgpt-user-images` | Shows an invented **OpenAI-branded research building with humanoid robots** physically sending picture cards to an external server. Readers may mistake a fictional staging for documentary evidence of a disclosed incident | Caption explicitly states no actual OpenAI facilities or systems are depicted; alt accurately calls the lab fictional | Neutral conceptual diagram with unlabeled research environment, anonymized image cards and generic external hosting, without real-looking facilities, OpenAI robots or screenshot-style branding |
| P2 | `google-photos-android-undo-backup-keep-phone-photos` | Curved light trails appear to connect or upload from the phone to a cloud. The art does not clearly depict **removal of cloud copies while keeping local files** | Change alt to describe what is actually visible, not claim a disconnected link | Two distinct phone/cloud collections; clearly severed backup connection; local photo thumbnails visibly remaining on the phone; no ambiguous arrows |
| P2 | `google-photos-free-up-space-what-it-deletes` | A phone-side trash arrow and thumbnails flowing towards a cloud can imply simultaneous upload/deletion. The critical distinction is **already backed-up cloud copies remain after local removal** | Clarify alt to refer to device deletion and retained cloud images | Side-by-side **before/after** diagram showing local backed-up files removed only from device; cloud library unchanged; no fake app UI |

## Complete article-to-image review

| Article slug | Visual content seen | Review |
| --- | --- | --- |
| `ai-shopping-agents-scam-fraud-privacy-risks` | Person, shopping agent, product choices, payment card and threat motif | Suitable as an illustration; not proof of any scam |
| `chatgpt-memory-vs-chat-history-model-training` | Conversation cards, brain-like memory layer, servers and private-chat channel | Suitable |
| `chrome-enhanced-protection-vs-standard-protection` | Browser with basic and stacked protective shields | Suitable; not actual Chrome UI |
| `delete-chatgpt-chat-uploaded-files-library` | Disappearing conversation cards beside a retained document folder | Suitable |
| `does-icloud-backup-include-photos` | Phone with separate cloud photo layer and an amber backup/archive | Suitable |
| `fake-tech-support-scams-remote-access-verification-code` | Warning on laptop, incoming phone call and lock shield | Suitable |
| `gemini-memory-turn-off-delete-past-chats` | Conversation tile, layered records, delete and temporary-chat symbols | Suitable |
| `gemini-temporary-chat-vs-keep-activity-off` | Conversation pathway disintegrating versus saved message cards | Suitable |
| `gmail-not-receiving-emails-google-storage-full` | Envelopes, smartphone, cloud storage gauge and photo/document files | Suitable; gauge is illustrative, not an exact quota |
| `google-authenticator-new-phone-codes-missing` | Two phones joined by token path with separate cloud-sync representation | Suitable |
| `google-passkey-vs-2-step-verification` | Device key/lock and separate code-and-shield path | Suitable |
| `google-photos-android-undo-backup-keep-phone-photos` | Phone thumbnails and cloud joined by curved paths | **P2:** link appears active rather than disabled |
| `google-photos-free-up-space-what-it-deletes` | Google Photos-like UI, device-side trash icon and cloud retaining images | **P2:** ambiguous deletion/upload sequence; generic legacy filename |
| `google-photos-locked-folder-backup-lost-phone` | Locked on-device folder, local thumbnails and cloud image path | Suitable, but backup state depends on actual settings |
| `ios-26-7-1-cve-2026-86950-security-update` | Apple-style phone and tablet with protective lock shield | Suitable; does not depict real update screen |
| `iphone-storage-full-icloud-has-space` | Red local-capacity indicator and partially filled blue cloud gauge | Suitable |
| `meta-muse-privacy-access-memory-ai-training` | User with AI cloud, settings controls and model/data panels | Suitable conceptual representation, not actual toggles |
| `openai-agent-leak-53-chatgpt-user-images` | Branded fictional OpenAI research room with robots sending photo files | **P1:** risk of fabricated documentary depiction |
| `pixel-scam-detection-chat-gboard-privacy-2026` | Phone displaying alert near messages and keyboard | Suitable conceptual representation, not a product screenshot |
| `remove-third-party-google-access-without-losing-login` | Account permission hub with detached connection plug | Suitable |
| `samsung-one-ui-9-rollout-features-eligible-galaxy-phones` | Stylized Galaxy-like phones, foldables, earbuds, watch and large “9” | Suitable as conceptual feature art; not a Samsung press photograph |
| `siri-ai-privacy-ios-27-apple-intelligence-data` | Siri-like phone with cloud/server illustration and privacy control | Suitable; toggle is not a real settings screen |
| `transfer-google-photos-another-account` | Image cards being copied from one cloud account to another | Suitable |
| `turn-off-icloud-photos-without-losing-photos-iphone` | Phone and cloud holding photos with broken chain icon | Suitable |
| `unknown-device-google-account-session` | Phone and unfamiliar computer linked to account badge | Suitable; security checkmark is illustrative |
| `whatsapp-two-step-verification-password` | WhatsApp-style mark, lock, six-dot PIN and longer hidden code | Suitable conceptual comparison, not a confirmed UI screenshot |

## Editorial safeguards
1. Retain the original published WebP paths and all article URLs until replacement artwork is ready and properly reviewed.
2. Do not present incident-related generated art as documentary evidence or portray branded fictional laboratories as real.
3. Use concise, **visually truthful** `heroImageAlt`; an alt must not explain an element that is not actually shown.
4. Label concept art as such in the article caption; visual credibility is more important than unsupported “original artwork” claims.
5. Before making new source images, visually check the desktop/mobile crops; keep existing original WebP dimensions and responsive-image generation contract.
6. Re-check all 26 after any replacement. The repo's automated editorial test checks existence/dimensions/alt uniqueness, not semantics or provenance.
