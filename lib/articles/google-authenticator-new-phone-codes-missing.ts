import type { Article, InlineContent, RichText } from "@/lib/content";

const strong = (text: string): InlineContent => ({ type: "strong", text });
const link = (text: string, href: string): InlineContent => ({ type: "link", text, href });
const rich = (...content: InlineContent[]): RichText => content;

export const googleAuthenticatorNewPhoneArticle: Article = {
  title: "Google Authenticator on a New Phone: Sync, Transfer, or Recover Codes",
  seoTitle: "Google Authenticator Codes Missing on a New Phone?",
  slug: "google-authenticator-new-phone-codes-missing",
  description: "Missing Google Authenticator codes on a new phone? Choose the right sync, transfer or account recovery path, then verify access before retiring the old phone.",
  standfirst: "New phone, missing codes? Find the right route for synced entries, an available old phone or account recovery—and check access before retiring your old device.",
  category: "security",
  contentType: "how-to",
  tags: ["Google Authenticator", "Two-factor authentication", "Account security", "Account recovery", "Google Account", "Phone migration"],
  author: "DECODISTA Editorial",
  publishedDate: "2026-09-18",
  updatedDate: "2026-09-18",
  checkedDate: "2026-09-18",
  featuredImage: "/images/google-authenticator-new-phone.webp",
  featuredImageAlt: "Two unbranded phones exchanging abstract authenticator tokens through a protected direct path beside a separate cloud sync route",
  featuredImageWidth: 1672,
  featuredImageHeight: 941,
  readingTime: 13,
  relatedArticleSlugs: [
    "remove-third-party-google-access-without-losing-login",
    "google-photos-android-undo-backup-keep-phone-photos",
  ],
  shortAnswer: rich(
    "If your Google Authenticator codes are missing on a new phone, start with how they were stored. Previously synced entries can return through the Google Account used in Authenticator. If you still have the old phone, you can transfer entries directly. If neither is available, you need the affected account’s alternative sign-in or recovery process; recovery is not guaranteed. ",
    link("Google’s Authenticator guidance", "https://support.google.com/accounts/answer/1066447?hl=en"),
  ),
  content: [
    { type: "heading", level: 2, id: "key-takeaways", text: "Key takeaways" },
    {
      type: "list",
      style: "unordered",
      items: [
        rich("Check the account selected ", strong("inside Authenticator"), ", rather than assuming the account used in Gmail is the right one."),
        "Keep the old phone until you have tested access on the new one.",
        "Keep recovery options somewhere you can reach without the missing phone.",
        "Treat transfer QR codes and setup keys as secrets. Never publish them, send them to another person or include them in a support screenshot.",
        "Keep multi-factor authentication enabled during migration.",
      ],
    },
    { type: "heading", level: 2, id: "choose-recovery-path", text: "Start here: choose your recovery path" },
    { type: "paragraph", text: "“Old phone available” means you can unlock it and open the Authenticator entries—not simply that you still own the handset." },
    {
      type: "table",
      headers: ["Path", "Old phone available?", "Were the missing entries synced?", "Can you use another sign-in method?", "What to do"],
      rows: [
        [rich(strong("1. Restore through sync")), "Either", "Yes", "Needed if you cannot enter the Google Account holding them", "Check that Google Account in Authenticator on the new phone. Resolve Google sign-in first if necessary."],
        [rich(strong("2. Transfer from the old phone")), "Yes", "No, or uncertain", "Keep a fallback available", "Use the manual transfer process below, then test the new phone."],
        [rich(strong("3. Recover individual accounts")), "No", "No", "Yes: use the service’s supported alternative. No: follow its recovery process.", "Work through each affected service separately. Do not assume its support team can restore access."],
      ],
    },
    {
      type: "paragraph",
      text: rich(
        "If you are unsure about sync, check your plausible Google Accounts before treating the entries as lost. Google’s app supports both account sync and QR transfers; Google Account fallback methods depend on what you previously set up. ",
        link("Official app description", "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"),
        ", ",
        link("Google sign-in troubleshooting", "https://support.google.com/accounts/answer/185834?hl=en"),
      ),
    },
    {
      type: "callout",
      title: "Before changing anything",
      text: "Do not wipe the old phone, clear Authenticator’s storage or delete entries to “tidy up”. First establish a working route into every account you need. If the phone has been stolen, also follow the security steps under “If the old phone is lost or stolen”.",
    },
    { type: "heading", level: 2, id: "restore-synced-entries", text: "Path 1: restore synced entries" },
    { type: "heading", level: 3, id: "what-sync-does", text: "What sync does" },
    {
      type: "paragraph",
      text: rich(
        "Google Account sync saves Authenticator entries so they can be available on other devices. Manual transfer sends selected entries directly using a QR code. Neither process should be treated as proof that an old phone has lost access. ",
        link("Google’s app description", "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"),
      ),
    },
    { type: "paragraph", text: rich("Here, an ", strong("entry"), " means the saved item for an account inside Authenticator. Its changing sign-in code is different from a saved recovery code supplied by a service.") },
    {
      type: "paragraph",
      text: rich(
        "For a synced setup, install Google Authenticator on the new phone and sign in to the Google Account that held the entries. Signing into a different Google Account will not retrieve that saved set. ",
        link("Google’s Authenticator guidance", "https://support.google.com/accounts/answer/1066447?hl=en"),
      ),
    },
    { type: "heading", level: 3, id: "check-google-account", text: "Check which Google Account is selected" },
    {
      type: "paragraph",
      text: rich(
        "Open the profile icon at the top right of Authenticator and check the signed-in account. Check other Google Accounts you used, if necessary. ",
        link("Google’s account-selection instructions", "https://support.google.com/accounts/answer/1066447?hl=en"),
      ),
    },
    { type: "paragraph", text: rich("Compare the ", strong("full email address"), ", especially if your personal and work accounts have similar names. An email label beside a third-party entry is not sufficient evidence of which Google Account holds your sync data.") },
    { type: "paragraph", text: "Once entries appear, go to the verification checklist below. Do not use “I can see a list” as your only migration test." },
    { type: "heading", level: 3, id: "account-free-mode", text: "What if you use Authenticator without an account?" },
    {
      type: "paragraph",
      text: rich(
        "Google supports account-free use and manual transfer. However, switching an existing synced setup to account-free mode removes its codes from all Google Accounts and leaves them on that device, unavailable on other devices, according to the current help page. ",
        link("Google’s account-free guidance", "https://support.google.com/accounts/answer/1066447?hl=en"),
      ),
    },
    { type: "paragraph", text: rich(strong("DECODISTA recommendation:"), " Do not switch storage modes while diagnosing missing entries. First identify your working copies and recovery options. Turning on sync later cannot be relied on to retrieve entries that existed only on a lost phone.") },
    { type: "heading", level: 2, id: "manual-transfer", text: "Path 2: manually transfer from the old phone" },
    { type: "paragraph", text: "Use this route while the old phone can still display the entries." },
    {
      type: "list",
      style: "ordered",
      items: [
        "Install Google Authenticator on the new phone and update the old phone’s app.",
        rich("On the old phone, open ", strong("Menu → Transfer accounts → Export accounts"), "."),
        "Unlock when requested, select the entries and continue.",
        rich("On the new phone, choose ", strong("Menu → Transfer accounts → Import accounts"), "."),
        "Scan the old phone’s transfer QR code directly. There may be several.",
        "Wait for the transfer confirmation, then verify access as described below.",
      ],
    },
    {
      type: "paragraph",
      text: rich(
        "These are Google’s documented transfer controls for ",
        link("Android", "https://support.google.com/accounts/answer/1066447?hl=en"),
        " and ",
        link("iPhone/iPad", "https://support.google.com/accounts/answer/1066447?hl=en&co=GENIE.Platform%3DiOS"),
        ".",
      ),
    },
    { type: "paragraph", text: rich(strong("Documentation note:"), " Google says manual transfer works without an account, although its numbered walkthrough includes a Google sign-in step. Follow the storage choice you intend; do not interpret that step as proof that sync is mandatory. Exact onboarding screens may differ.") },
    { type: "paragraph", text: rich(strong("DECODISTA recommendation:"), " Do the scan privately between devices you control. Do not email the QR code to yourself or use a public QR-reading website. If scanning fails, stop and check the app’s camera permission and on-screen instructions rather than sharing the image.") },
    { type: "paragraph", text: "Manual transfer is a migration method. If your aim is to invalidate a potentially exposed authenticator, use the affected service’s security settings and replacement procedure." },
    { type: "heading", level: 2, id: "lost-unsynced-device", text: "Path 3: the old phone is gone and the entries were not synced" },
    { type: "paragraph", text: "Your next task is to recover access to each account." },
    { type: "paragraph", text: "Make a simple list of affected services. For each one, note whether you have a working session, a recovery code or another authentication method. Record the method’s existence—not its secret—in your checklist." },
    {
      type: "table",
      headers: ["Account you need", "Where to look for help", "What successful recovery gives you"],
      rows: [
        [rich(strong("The Google Account used for Authenticator sync")), "Google’s available alternative sign-in methods, then Google Account recovery if needed", "Access to that Google Account; you can then check for previously synced entries"],
        [rich(strong("Another personal Google Account")), "That account’s own backup methods or recovery process", "Access to that specific account"],
        [rich(strong("A third-party account, such as GitHub")), "That service’s saved recovery codes, supported alternatives or official recovery process", "Access under that service’s rules; follow its instructions to register a replacement authenticator"],
        [rich(strong("A managed work or school account")), "Your organisation’s administrator and approved recovery process", "Access subject to the organisation’s controls"],
      ],
    },
    {
      type: "paragraph",
      text: rich(
        "For Google, alternatives can include a previously configured security key, a passkey on another device or saved backup codes. Availability depends on the account. If those routes fail, use ",
        link("Google Account recovery", "https://support.google.com/accounts/answer/7682439?hl=en"),
        ". Managed accounts may need an administrator. ",
        link("Google’s lost-phone and verification guidance", "https://support.google.com/accounts/answer/185834?hl=en"),
      ),
    },
    { type: "heading", level: 3, id: "third-party-recovery", text: "Why third-party services need separate recovery" },
    { type: "paragraph", text: "Keeping a service’s code in Google Authenticator does not make Google that service’s account administrator." },
    {
      type: "paragraph",
      text: rich(
        "Recovery is service-specific. GitHub, for example, documents its own recovery codes and alternative credentials. It also warns that support cannot restore access when the necessary authentication and recovery methods are unavailable. That is a GitHub rule, not a universal rule for every service. ",
        link("GitHub’s official recovery documentation", "https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/recovering-your-account-if-you-lose-your-2fa-credentials"),
      ),
    },
    { type: "paragraph", text: rich(strong("DECODISTA recommendation:"), " Open each provider’s official website yourself. Look for its instructions for a lost authenticator or unavailable second factor. Once admitted, follow its replacement process and retain MFA protection. Do not assume a password reset alone will resolve the missing second factor.") },
    { type: "heading", level: 2, id: "backup-codes", text: "Google Account backup codes: their precise role" },
    { type: "paragraph", text: rich("Google backup codes are emergency second-step credentials for the ", strong("Google Account that issued them"), ". They do not recover an unrelated third-party account or rebuild an unsynced Authenticator entry.") },
    {
      type: "paragraph",
      text: rich(
        "To use one, choose ",
        strong("Try another way"),
        " during Google sign-in and select the backup-code option. Each code works once. Creating a replacement set invalidates the previous set. Google also says backup-code downloads are unavailable under Advanced Protection. ",
        link("Google’s backup-code documentation", "https://support.google.com/accounts/answer/1187538?hl=en"),
      ),
    },
    { type: "paragraph", text: "There is an indirect benefit: getting back into the Google Account may let you retrieve entries that had already been synced there. That is different from recovering entries that were never saved to it." },
    { type: "paragraph", text: rich("For preparation, find ", strong("Backup codes"), " under your Google Account’s ", strong("Security & sign-in → 2-Step Verification"), " settings. Store them securely somewhere accessible without the phone you are replacing.") },
    { type: "heading", level: 2, id: "migration-checklist", text: "Verify the new phone before retiring the old one" },
    { type: "paragraph", text: rich("This is ", strong("DECODISTA’s recommended migration checklist"), ", not a claim that we tested your setup.") },
    {
      type: "list",
      style: "unordered",
      items: [
        "☐ List every important account, including multiple accounts at the same service.",
        "☐ Confirm that the expected entries appear on the new phone.",
        "☐ Keep an existing trusted session open. In a separate browser session, attempt a fresh sign-in to an important account.",
        rich("☐ Where offered, select authenticator-code verification and enter the code from the ", strong("new"), " phone yourself."),
        "☐ Repeat for each account you need. A successful passkey sign-in is useful, but it does not test an Authenticator code.",
        "☐ Check that at least one appropriate fallback remains accessible independently of the old phone.",
        "☐ Record which accounts passed. Do not record live codes, QR images or setup keys.",
        "☐ Retire the old phone only after unresolved accounts have a safe, working access route.",
      ],
    },
    {
      type: "paragraph",
      text: rich(
        "For Google, newly changed authentication or recovery methods may take up to seven days to become available. A trusted passkey or security key may allow earlier approval. This is a Google Account security delay, ",
        strong("not a published Authenticator sync waiting period"),
        ". ",
        link("Google’s lockout-prevention guidance", "https://support.google.com/accounts/answer/7684753?hl=en"),
      ),
    },
    {
      type: "paragraph",
      text: rich(
        "Before selling or giving away a phone, complete its manufacturer’s handover and factory-reset procedure after protecting all data you need—not just Authenticator. Google also provides a way to review and sign out device sessions. ",
        link("Google’s device-access guidance", "https://support.google.com/accounts/answer/3067630?hl=en"),
      ),
    },
    { type: "heading", level: 2, id: "delete-synced-entry", text: "What happens if you delete a synced entry?" },
    {
      type: "paragraph",
      text: rich(
        "Deleting a synced Authenticator entry also deletes it from the other devices syncing that entry. ",
        link("Google’s deletion guidance", "https://support.google.com/accounts/answer/1066447?hl=en"),
      ),
    },
    { type: "paragraph", text: "Do not use entry deletion as an old-phone cleanup method. It is also not a substitute for changing a service’s MFA settings." },
    { type: "paragraph", text: "If you already deleted an entry, keep any working account session open and check the service’s supported recovery or authenticator-replacement route before making further changes." },
    { type: "heading", level: 2, id: "lost-or-stolen-phone", text: "If the old phone is lost or stolen" },
    { type: "paragraph", text: "Restoring access on the new phone and securing the missing phone are separate jobs." },
    {
      type: "paragraph",
      text: rich(
        "Use the relevant lost-device controls. For Android, Google documents remote locking and erasure through Find Hub, with prerequisites including connectivity for remote securing or erasure. Erasing a device permanently removes its data and may not erase an SD card. Read the consequences before confirming. ",
        link("Google’s lost-Android guidance", "https://support.google.com/accounts/answer/6160491?hl=en"),
      ),
    },
    {
      type: "paragraph",
      text: rich(
        "Review the missing phone under your Google Account’s device sessions and sign it out. Google also recommends changing your Google Account password after a lost or stolen phone. ",
        link("Device-session controls", "https://support.google.com/accounts/answer/3067630?hl=en"),
        ", ",
        link("Google’s lost-phone advice", "https://support.google.com/accounts/answer/185834?hl=en"),
      ),
    },
    { type: "paragraph", text: "For affected third-party accounts, follow each provider’s procedure to replace a potentially exposed authenticator. Do not assume that transferring entries, changing a Google password or signing out a device immediately invalidates every third-party code." },
    { type: "heading", level: 2, id: "codes-do-not-work", text: "The entries are there, but the codes do not work" },
    { type: "paragraph", text: "Check the service and username, enter a fresh code before it expires, and check the phone’s date and time settings." },
    {
      type: "paragraph",
      text: rich(
        "Google says Authenticator version 7.0 removed its internal time-correction setting; the app uses operating-system time. ",
        link("Current troubleshooting guidance", "https://support.google.com/accounts/answer/1066447?hl=en"),
      ),
    },
    { type: "paragraph", text: rich(strong("DECODISTA recommendation:"), " Use your phone’s automatic date and time setting where available. Do not spend time searching for an old tutorial’s “Sync now” menu.") },
    { type: "paragraph", text: "If a service still rejects the code, use a working alternative method and consult that service’s help. Avoid deleting the entry or clearing app data as an experiment." },
    { type: "heading", level: 2, id: "common-mistakes", text: "Common mistakes" },
    {
      type: "list",
      style: "unordered",
      items: [
        rich(strong("Retiring the old phone after checking just one account."), " Verify the full list."),
        rich(strong("Assuming a normal phone backup proves Authenticator recovery will work."), " Test the specific migration route you intend to rely on."),
        rich(strong("Keeping the only recovery material on the phone being replaced."), " Make sure you can reach it independently."),
        rich(strong("Treating a trusted, already-open session as a test."), " Use a fresh authentication attempt."),
        rich(
          strong("Sending a code to someone offering recovery help."),
          " Enter credentials only into the official sign-in flow you initiated. Google warns against account-recovery services and sharing verification codes. ",
          link("Google’s recovery guidance", "https://support.google.com/accounts/answer/7682439?hl=en"),
        ),
      ],
    },
    { type: "heading", level: 2, id: "faq", text: "FAQ" },
    { type: "heading", level: 3, id: "transfer-without-old-phone", text: "Can I transfer Google Authenticator without the old phone?" },
    { type: "paragraph", text: "Use Path 1 if the entries were synced. Otherwise, follow Path 3 for each affected account. Do not count on an unsynced, device-only entry being recoverable after that device is gone." },
    { type: "heading", level: 3, id: "same-account-codes-missing", text: "I used the same Google Account on the new phone. Why are codes missing?" },
    { type: "paragraph", text: rich("Check that account ", strong("inside Authenticator"), " and whether it was actually used to save the missing entries. A phone’s general Google sign-in is not enough evidence. Use the account-selection checks above.") },
    { type: "heading", level: 3, id: "mobile-signal", text: "Do I need a mobile signal to generate codes?" },
    {
      type: "paragraph",
      text: rich(
        "No. Once set up, Authenticator can generate codes without internet or mobile service. That does not mean a new phone can retrieve synced entries while offline. ",
        link("Google’s app description", "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"),
      ),
    },
    { type: "heading", level: 3, id: "backup-codes-other-accounts", text: "Will Google backup codes restore all my other accounts?" },
    { type: "paragraph", text: "No. Use the recovery material issued by the service you need. The Google-versus-third-party table above separates those routes." },
    { type: "heading", level: 3, id: "disable-mfa", text: "Should I disable MFA before changing phones?" },
    { type: "paragraph", text: "No. Use sync, transfer or the service’s supported recovery and replacement process. Keep an independent fallback available and verify the new setup." },
    { type: "heading", level: 2, id: "sources-verification", text: "Sources and verification" },
    { type: "paragraph", text: rich("Information checked against current official documentation on ", strong("18 September 2026 (UTC)"), ", including Google’s Android and iPhone/iPad Authenticator instructions, Google Account backup-code and recovery guidance, and GitHub’s recovery policy as one service-specific example.") },
    { type: "paragraph", text: "This article is based on documentation review. DECODISTA has not performed the proposed device tests or captured the screenshots described in the editorial handoff." },
    {
      type: "paragraph",
      text: rich(
        "Related reading: ",
        link("removing a Google connection without losing access", "/articles/remove-third-party-google-access-without-losing-login"),
        ", and ",
        link("check what is stored on the phone and in the cloud", "/articles/google-photos-android-undo-backup-keep-phone-photos"),
        ".",
      ),
    },
  ],
};
