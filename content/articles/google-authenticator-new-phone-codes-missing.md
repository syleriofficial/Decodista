---
title: "Google Authenticator on a New Phone: Sync, Transfer, or Recover Codes"
slug: google-authenticator-new-phone-codes-missing
deck: New phone, missing codes? Find the right route for synced entries, an available old phone or account recovery—and check access before retiring your old device.
primaryCategory: security
contentType: how-to
topics:
  - Google Authenticator
  - Two-Factor Authentication
  - Account Security
  - Account Recovery
  - Google Account
  - Phone Migration
heroImage: /images/google-authenticator-new-phone.webp
heroImageAlt: Two unbranded phones exchanging abstract authenticator tokens through a protected direct path beside a separate cloud sync route
heroImageWidth: 1672
heroImageHeight: 941
shortAnswer: If your Google Authenticator codes are missing on a new phone, start with how they were stored. Previously synced entries can return through the Google Account used in Authenticator. If you still have the old phone, you can transfer entries directly. If neither is available, you need the affected account’s alternative sign-in or recovery process; recovery is not guaranteed. [Google’s Authenticator guidance](<https://support.google.com/accounts/answer/1066447?hl=en>)
keyTakeaways:
  - Check the account selected **inside Authenticator**, rather than assuming the account used in Gmail is the right one.
  - Keep the old phone until you have tested access on the new one.
  - Keep recovery options somewhere you can reach without the missing phone.
  - Treat transfer QR codes and setup keys as secrets. Never publish them, send them to another person or include them in a support screenshot.
  - Keep multi-factor authentication enabled during migration.
publishedAt: 2026-09-18
informationCheckedAt: 2026-09-18
author: DECODISTA Editorial
readingTime: 13
featured: false
editorsPick: false
seoTitle: Google Authenticator Codes Missing on a New Phone?
metaDescription: Missing Google Authenticator codes on a new phone? Choose the right sync, transfer or account recovery path, then verify access before retiring the old phone.
relatedArticles:
  - remove-third-party-google-access-without-losing-login
  - google-photos-android-undo-backup-keep-phone-photos
faqs:
  - question: Can I transfer Google Authenticator without the old phone?
    id: transfer-without-old-phone
    answer: Use Path 1 if the entries were synced. Otherwise, follow Path 3 for each affected account. Do not count on an unsynced, device-only entry being recoverable after that device is gone.
  - question: I used the same Google Account on the new phone. Why are codes missing?
    id: same-account-codes-missing
    answer: Check that account **inside Authenticator** and whether it was actually used to save the missing entries. A phone’s general Google sign-in is not enough evidence. Use the account-selection checks above.
  - question: Do I need a mobile signal to generate codes?
    id: mobile-signal
    answer: No. Once set up, Authenticator can generate codes without internet or mobile service. That does not mean a new phone can retrieve synced entries while offline. [Google’s app description](<https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2>)
  - question: Will Google backup codes restore all my other accounts?
    id: backup-codes-other-accounts
    answer: No. Use the recovery material issued by the service you need. The Google-versus-third-party table above separates those routes.
  - question: Should I disable MFA before changing phones?
    id: disable-mfa
    answer: No. Use sync, transfer or the service’s supported recovery and replacement process. Keep an independent fallback available and verify the new setup.
sourcesVerification: |-
  Information checked against current official documentation on **18 September 2026 (UTC)**, including Google’s Android and iPhone/iPad Authenticator instructions, Google Account backup-code and recovery guidance, and GitHub’s recovery policy as one service-specific example.

  This article is based on documentation review. DECODISTA has not performed the proposed device tests or captured the screenshots described in the editorial handoff.

  Related reading: [removing a Google connection without losing access](</articles/remove-third-party-google-access-without-losing-login>), and [check what is stored on the phone and in the cloud](</articles/google-photos-android-undo-backup-keep-phone-photos>).
---

## Start here: choose your recovery path {#choose-recovery-path}

“Old phone available” means you can unlock it and open the Authenticator entries—not simply that you still own the handset.

| Path | Old phone available? | Were the missing entries synced? | Can you use another sign-in method? | What to do |
| --- | --- | --- | --- | --- |
| **1. Restore through sync** | Either | Yes | Needed if you cannot enter the Google Account holding them | Check that Google Account in Authenticator on the new phone. Resolve Google sign-in first if necessary. |
| **2. Transfer from the old phone** | Yes | No, or uncertain | Keep a fallback available | Use the manual transfer process below, then test the new phone. |
| **3. Recover individual accounts** | No | No | Yes: use the service’s supported alternative. No: follow its recovery process. | Work through each affected service separately. Do not assume its support team can restore access. |

If you are unsure about sync, check your plausible Google Accounts before treating the entries as lost. Google’s app supports both account sync and QR transfers; Google Account fallback methods depend on what you previously set up. [Official app description](<https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2>), [Google sign-in troubleshooting](<https://support.google.com/accounts/answer/185834?hl=en>)

> **DECODISTA callout — Before changing anything**
>
> Do not wipe the old phone, clear Authenticator’s storage or delete entries to “tidy up”. First establish a working route into every account you need. If the phone has been stolen, also follow the security steps under “If the old phone is lost or stolen”.

## Path 1: restore synced entries {#restore-synced-entries}

### What sync does {#what-sync-does}

Google Account sync saves Authenticator entries so they can be available on other devices. Manual transfer sends selected entries directly using a QR code. Neither process should be treated as proof that an old phone has lost access. [Google’s app description](<https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2>)

Here, an **entry** means the saved item for an account inside Authenticator. Its changing sign-in code is different from a saved recovery code supplied by a service.

For a synced setup, install Google Authenticator on the new phone and sign in to the Google Account that held the entries. Signing into a different Google Account will not retrieve that saved set. [Google’s Authenticator guidance](<https://support.google.com/accounts/answer/1066447?hl=en>)

### Check which Google Account is selected {#check-google-account}

Open the profile icon at the top right of Authenticator and check the signed-in account. Check other Google Accounts you used, if necessary. [Google’s account-selection instructions](<https://support.google.com/accounts/answer/1066447?hl=en>)

Compare the **full email address**, especially if your personal and work accounts have similar names. An email label beside a third-party entry is not sufficient evidence of which Google Account holds your sync data.

Once entries appear, go to the verification checklist below. Do not use “I can see a list” as your only migration test.

### What if you use Authenticator without an account? {#account-free-mode}

Google supports account-free use and manual transfer. However, switching an existing synced setup to account-free mode removes its codes from all Google Accounts and leaves them on that device, unavailable on other devices, according to the current help page. [Google’s account-free guidance](<https://support.google.com/accounts/answer/1066447?hl=en>)

**DECODISTA recommendation:** Do not switch storage modes while diagnosing missing entries. First identify your working copies and recovery options. Turning on sync later cannot be relied on to retrieve entries that existed only on a lost phone.

## Path 2: manually transfer from the old phone {#manual-transfer}

Use this route while the old phone can still display the entries.

1. Install Google Authenticator on the new phone and update the old phone’s app.
2. On the old phone, open **Menu → Transfer accounts → Export accounts**.
3. Unlock when requested, select the entries and continue.
4. On the new phone, choose **Menu → Transfer accounts → Import accounts**.
5. Scan the old phone’s transfer QR code directly. There may be several.
6. Wait for the transfer confirmation, then verify access as described below.

These are Google’s documented transfer controls for [Android](<https://support.google.com/accounts/answer/1066447?hl=en>) and [iPhone/iPad](<https://support.google.com/accounts/answer/1066447?hl=en&co=GENIE.Platform%3DiOS>).

**Documentation note:** Google says manual transfer works without an account, although its numbered walkthrough includes a Google sign-in step. Follow the storage choice you intend; do not interpret that step as proof that sync is mandatory. Exact onboarding screens may differ.

**DECODISTA recommendation:** Do the scan privately between devices you control. Do not email the QR code to yourself or use a public QR-reading website. If scanning fails, stop and check the app’s camera permission and on-screen instructions rather than sharing the image.

Manual transfer is a migration method. If your aim is to invalidate a potentially exposed authenticator, use the affected service’s security settings and replacement procedure.

## Path 3: the old phone is gone and the entries were not synced {#lost-unsynced-device}

Your next task is to recover access to each account.

Make a simple list of affected services. For each one, note whether you have a working session, a recovery code or another authentication method. Record the method’s existence—not its secret—in your checklist.

| Account you need | Where to look for help | What successful recovery gives you |
| --- | --- | --- |
| **The Google Account used for Authenticator sync** | Google’s available alternative sign-in methods, then Google Account recovery if needed | Access to that Google Account; you can then check for previously synced entries |
| **Another personal Google Account** | That account’s own backup methods or recovery process | Access to that specific account |
| **A third-party account, such as GitHub** | That service’s saved recovery codes, supported alternatives or official recovery process | Access under that service’s rules; follow its instructions to register a replacement authenticator |
| **A managed work or school account** | Your organisation’s administrator and approved recovery process | Access subject to the organisation’s controls |

For Google, alternatives can include a previously configured security key, a passkey on another device or saved backup codes. Availability depends on the account. If those routes fail, use [Google Account recovery](<https://support.google.com/accounts/answer/7682439?hl=en>). Managed accounts may need an administrator. [Google’s lost-phone and verification guidance](<https://support.google.com/accounts/answer/185834?hl=en>)

### Why third-party services need separate recovery {#third-party-recovery}

Keeping a service’s code in Google Authenticator does not make Google that service’s account administrator.

Recovery is service-specific. GitHub, for example, documents its own recovery codes and alternative credentials. It also warns that support cannot restore access when the necessary authentication and recovery methods are unavailable. That is a GitHub rule, not a universal rule for every service. [GitHub’s official recovery documentation](<https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/recovering-your-account-if-you-lose-your-2fa-credentials>)

**DECODISTA recommendation:** Open each provider’s official website yourself. Look for its instructions for a lost authenticator or unavailable second factor. Once admitted, follow its replacement process and retain MFA protection. Do not assume a password reset alone will resolve the missing second factor.

## Google Account backup codes: their precise role {#backup-codes}

Google backup codes are emergency second-step credentials for the **Google Account that issued them**. They do not recover an unrelated third-party account or rebuild an unsynced Authenticator entry.

To use one, choose **Try another way** during Google sign-in and select the backup-code option. Each code works once. Creating a replacement set invalidates the previous set. Google also says backup-code downloads are unavailable under Advanced Protection. [Google’s backup-code documentation](<https://support.google.com/accounts/answer/1187538?hl=en>)

There is an indirect benefit: getting back into the Google Account may let you retrieve entries that had already been synced there. That is different from recovering entries that were never saved to it.

For preparation, find **Backup codes** under your Google Account’s **Security & sign-in → 2-Step Verification** settings. Store them securely somewhere accessible without the phone you are replacing.

## Verify the new phone before retiring the old one {#migration-checklist}

This is **DECODISTA’s recommended migration checklist**, not a claim that we tested your setup.

- ☐ List every important account, including multiple accounts at the same service.
- ☐ Confirm that the expected entries appear on the new phone.
- ☐ Keep an existing trusted session open. In a separate browser session, attempt a fresh sign-in to an important account.
- ☐ Where offered, select authenticator-code verification and enter the code from the **new** phone yourself.
- ☐ Repeat for each account you need. A successful passkey sign-in is useful, but it does not test an Authenticator code.
- ☐ Check that at least one appropriate fallback remains accessible independently of the old phone.
- ☐ Record which accounts passed. Do not record live codes, QR images or setup keys.
- ☐ Retire the old phone only after unresolved accounts have a safe, working access route.

For Google, newly changed authentication or recovery methods may take up to seven days to become available. A trusted passkey or security key may allow earlier approval. This is a Google Account security delay, **not a published Authenticator sync waiting period**. [Google’s lockout-prevention guidance](<https://support.google.com/accounts/answer/7684753?hl=en>)

Before selling or giving away a phone, complete its manufacturer’s handover and factory-reset procedure after protecting all data you need—not just Authenticator. Google also provides a way to review and sign out device sessions. [Google’s device-access guidance](<https://support.google.com/accounts/answer/3067630?hl=en>)

## What happens if you delete a synced entry? {#delete-synced-entry}

Deleting a synced Authenticator entry also deletes it from the other devices syncing that entry. [Google’s deletion guidance](<https://support.google.com/accounts/answer/1066447?hl=en>)

Do not use entry deletion as an old-phone cleanup method. It is also not a substitute for changing a service’s MFA settings.

If you already deleted an entry, keep any working account session open and check the service’s supported recovery or authenticator-replacement route before making further changes.

## If the old phone is lost or stolen {#lost-or-stolen-phone}

Restoring access on the new phone and securing the missing phone are separate jobs.

Use the relevant lost-device controls. For Android, Google documents remote locking and erasure through Find Hub, with prerequisites including connectivity for remote securing or erasure. Erasing a device permanently removes its data and may not erase an SD card. Read the consequences before confirming. [Google’s lost-Android guidance](<https://support.google.com/accounts/answer/6160491?hl=en>)

Review the missing phone under your Google Account’s device sessions and sign it out. Google also recommends changing your Google Account password after a lost or stolen phone. [Device-session controls](<https://support.google.com/accounts/answer/3067630?hl=en>), [Google’s lost-phone advice](<https://support.google.com/accounts/answer/185834?hl=en>)

For affected third-party accounts, follow each provider’s procedure to replace a potentially exposed authenticator. Do not assume that transferring entries, changing a Google password or signing out a device immediately invalidates every third-party code.

## The entries are there, but the codes do not work {#codes-do-not-work}

Check the service and username, enter a fresh code before it expires, and check the phone’s date and time settings.

Google says Authenticator version 7.0 removed its internal time-correction setting; the app uses operating-system time. [Current troubleshooting guidance](<https://support.google.com/accounts/answer/1066447?hl=en>)

**DECODISTA recommendation:** Use your phone’s automatic date and time setting where available. Do not spend time searching for an old tutorial’s “Sync now” menu.

If a service still rejects the code, use a working alternative method and consult that service’s help. Avoid deleting the entry or clearing app data as an experiment.

## Common mistakes {#common-mistakes}

- **Retiring the old phone after checking just one account.** Verify the full list.
- **Assuming a normal phone backup proves Authenticator recovery will work.** Test the specific migration route you intend to rely on.
- **Keeping the only recovery material on the phone being replaced.** Make sure you can reach it independently.
- **Treating a trusted, already-open session as a test.** Use a fresh authentication attempt.
- **Sending a code to someone offering recovery help.** Enter credentials only into the official sign-in flow you initiated. Google warns against account-recovery services and sharing verification codes. DECODISTA’s [fake tech-support scam guide](</articles/fake-tech-support-scams-remote-access-verification-code>) covers verification-code and remote-access pressure. [Google’s recovery guidance](<https://support.google.com/accounts/answer/7682439?hl=en>)
