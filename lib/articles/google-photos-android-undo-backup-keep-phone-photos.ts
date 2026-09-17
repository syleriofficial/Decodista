import type { Article, InlineContent, RichText } from "@/lib/content";

const strong = (text: string): InlineContent => ({ type: "strong", text });
const link = (text: string, href: string): InlineContent => ({ type: "link", text, href });
const lineBreak: InlineContent = { type: "break" };
const rich = (...content: InlineContent[]): RichText => content;

export const googlePhotosUndoBackupArticle: Article = {
  title: "Google Photos on Android: Undo Backup Without Deleting Phone Photos",
  seoTitle: "Google Photos Undo Backup: Keep Photos on Your Android",
  slug: "google-photos-android-undo-backup-keep-phone-photos",
  description: "Use Google Photos Undo backup on Android carefully: verify phone copies, compare deletion options, and check other devices before removing cloud photos.",
  standfirst: "Undo backup can remove Google Photos cloud copies while preserving files on your Android device. Check real local files, make an independent copy and review other devices before changing your backup.",
  category: "digital-life",
  tags: ["Google Photos", "Android", "Photo Backup", "Cloud Storage", "Photo Storage", "Data Protection"],
  author: "DECODISTA Editorial",
  publishedDate: "2026-09-18",
  updatedDate: "2026-09-18",
  featuredImage: "/images/google-photos-undo-backup.webp",
  featuredImageAlt: "Unbranded smartphone holding local photo files beneath a separate cloud photo layer being disconnected",
  featuredImageWidth: 1672,
  featuredImageHeight: 941,
  readingTime: 12,
  featured: true,
  sample: false,
  content: [
    {
      type: "paragraph",
      text: rich(
        strong("DECODISTA — Technology, Decoded."),
        lineBreak,
        strong("Information checked on: 17 September 2026 (UTC)."),
      ),
    },
    {
      type: "paragraph",
      text: rich(
        strong("On Android, Undo backup removes Google Photos copies of items currently on that device while keeping the device files. It does not clear every cloud-only photo in your account."),
        " Before using it, verify the files and make an independent copy of anything important. ",
        link("Google’s Android deletion guide", "https://support.google.com/photos/answer/6128858?co=GENIE.Platform%3DAndroid&hl=en"),
      ),
    },
    { type: "paragraph", text: "This guide covers Android. Do not apply its steps or device-storage assumptions to an iPhone or iPad." },
    { type: "heading", level: 2, id: "key-takeaways", text: "Key takeaways" },
    {
      type: "list",
      style: "unordered",
      items: [
        "Decide whether you need space in your Google Account or on your phone.",
        "Check actual files, not just thumbnails.",
        "Protect important pictures before any deletion or removal.",
        "Review other devices and sharing settings before changing cloud storage.",
        "Afterward, check the phone and the cloud separately.",
      ],
    },
    { type: "heading", level: 2, id: "before-you-remove-anything", text: "Before you remove anything" },
    {
      type: "callout",
      title: "Stop if you cannot verify an independent copy of the photos you want to keep.",
      text: "For important pictures, DECODISTA recommends a checked copy on a computer or external drive as well as the phone files. Open the copied photos and play the videos before proceeding. Do not empty Trash, clear app data or reinstall Google Photos as part of this cleanup.",
    },
    { type: "paragraph", text: "The steps below describe Google’s documented controls. The independent-copy checks are DECODISTA’s precautions; they are not a claim that every Android device has been tested." },
    { type: "heading", level: 2, id: "four-actions", text: "Four actions with very different consequences" },
    { type: "paragraph", text: "Read the confirmation screen as well as the action name." },
    {
      type: "table",
      headers: ["Action", "Google Photos cloud copy", "Copy on this Android device", "Appropriate goal"],
      rows: [
        [rich(strong("Delete / Trash"), " in Google Photos"), "Selected backed-up item is deleted from the library", "Deleted too; deletion can reach other devices with Backup on", "Remove an unwanted item; unsuitable as a shortcut for keeping phone photos"],
        [rich(strong("Delete from device")), "Existing backed-up copy is kept", "Selected local file is removed", "Remove a particular phone copy after verifying another copy"],
        [rich(strong("Free up space")), "Backed-up items remain available in Google Photos", "Eligible backed-up local copies are removed", "Recover phone storage"],
        [rich(strong("Undo backup")), "Copies matching items on this device are removed", "Files are kept", "Reverse this device’s backup"],
      ],
    },
    {
      type: "paragraph",
      text: rich(
        "The deletion and Undo distinctions follow ",
        link("Google’s Android deletion guide", "https://support.google.com/photos/answer/6128858?co=GENIE.Platform%3DAndroid&hl=en"),
        ". The device-only options are documented in Google’s ",
        link("gallery integration guide", "https://support.google.com/photos/answer/14216276?hl=en"),
        " and ",
        link("Free up space guide", "https://support.google.com/photos/answer/6128843?co=GENIE.Platform%3DAndroid&hl=en"),
        ".",
      ),
    },
    {
      type: "paragraph",
      text: rich(
        strong("Free up space works towards the opposite storage goal from this article."),
        " Google says the removed phone files remain viewable through its online library, but are no longer available as those local copies for offline viewing. Recent items may be left on the phone. ",
        link("Google’s Free up space explanation", "https://support.google.com/photos/answer/6128843?co=GENIE.Platform%3DAndroid&hl=en"),
      ),
    },
    { type: "heading", level: 3, id: "cloud-or-phone-space", text: "Cloud space or phone space?" },
    {
      type: "table",
      headers: ["What you want", "Start here"],
      rows: [
        ["Keep phone originals and reduce their Google Photos backup", "Complete the safety checks, then consider Undo backup"],
        ["Keep the cloud collection and reduce phone storage", "Consider Free up space only after verifying backups and an independent copy"],
        ["Stop automatic uploads without removing existing pictures", "Review the Backup switch"],
        ["Remove only a few cloud pictures", "Review Google’s separate selected-item instructions; do not run a bulk action by mistake"],
      ],
    },
    {
      type: "paragraph",
      text: rich(
        strong("Backup off is a setting, not a deletion command."),
        " It stops automatic backup from that device; it does not itself remove earlier cloud uploads. Backup on enables automatic saving, including the device folders selected for backup. Google documents the switch under ",
        strong("Photos settings → Backup"),
        ". ",
        link("Google’s Android backup guide", "https://support.google.com/photos/answer/6193313?co=GENIE.Platform%3DAndroid&hl=en"),
      ),
    },
    { type: "heading", level: 2, id: "confirm-local-copy", text: "How to confirm a real local copy exists" },
    { type: "paragraph", text: "Seeing a picture inside Google Photos proves that the app can display it. It does not tell you where the file is stored." },
    {
      type: "paragraph",
      text: rich(
        "Even a phone’s separate gallery can show cloud pictures when it is connected to Google Photos. Google also warns that deleting through a connected gallery can affect cloud copies. ",
        link("Google’s gallery-access documentation", "https://support.google.com/photos/answer/14216276?hl=en"),
      ),
    },
    { type: "paragraph", text: "Use this practical check for ordinary photos and videos:" },
    {
      type: "list",
      style: "ordered",
      items: [
        rich(strong("Find the file in device storage."), " Use your file manager to inspect the actual camera or picture folder, such as DCIM/Camera. Look for a filename, folder location and file size."),
        rich(strong("Open that file while offline."), " Check the full picture and play the video. Treat a thumbnail or a cached preview as insufficient evidence."),
        rich(strong("Copy, rather than move, the files to independent storage."), " Keep the phone originals in place."),
        rich(strong("Check the destination."), " Open the copied files there. For a large collection, compare file counts and sizes, inspect samples from different dates and folders, and individually check irreplaceable items."),
      ],
    },
    {
      type: "paragraph",
      text: rich(
        "To check the ",
        strong("cloud backup"),
        " separately, open the item in Google Photos and use ",
        strong("More → About → Details"),
        ". Google says a backed-up item shows its backup status and size. This checks the upload, not whether a phone file still exists. ",
        link("Google’s backup-status instructions", "https://support.google.com/photos/answer/6193313?co=GENIE.Platform%3DAndroid&hl=en"),
      ),
    },
    {
      type: "paragraph",
      text: rich(
        "Google documents USB file transfer to supported computers. Choose a transfer method appropriate to your devices; this guide does not assume every computer uses the same steps. ",
        link("Google’s Android file-transfer guide", "https://support.google.com/android/answer/9064445?hl=en"),
      ),
    },
    {
      type: "paragraph",
      text: rich(
        "If a picture exists only online, preserve it before considering deletion. Google’s computer instructions let you select an item at Google Photos and download it. Open the downloaded file to verify it; a successful-looking download notification is not the final check. ",
        link("Google’s download guide", "https://support.google.com/photos/answer/7652919?hl=en"),
      ),
    },
    {
      type: "paragraph",
      text: rich(
        strong("Locked Folder requires a separate check."),
        " Its contents are not exposed to other photo apps, so a normal camera-folder copy is not evidence that you protected those items. If you cannot independently preserve important Locked Folder content, pause before the bulk operation. ",
        link("Google’s Locked Folder guide", "https://support.google.com/photos/answer/10694388"),
      ),
    },
    { type: "heading", level: 2, id: "pre-action-checklist", text: "Pre-action safety checklist" },
    { type: "paragraph", text: "Review the albums, sharing and Locked Folder section below before following the steps. Proceed only when you can answer yes to these questions:" },
    {
      type: "list",
      style: "unordered",
      items: [
        rich(strong("Right account?"), " Have you checked the account shown in Google Photos and its Backup settings?"),
        rich(strong("Right goal?"), " Are you trying to reduce cloud storage, rather than phone storage?"),
        rich(strong("Files verified?"), " Have you located and opened the phone files you intend to keep?"),
        rich(strong("Independent copy verified?"), " Is important content also readable somewhere outside this phone’s Photos library?"),
        rich(strong("Full scope reviewed?"), " Have you checked other device folders and Locked Folder, not only the camera roll?"),
        rich(strong("Other devices checked?"), " Have you reviewed phones and tablets using the same account and protected their important files?"),
        rich(strong("Sharing reviewed?"), " Have you checked whether anyone relies on albums or Partner Sharing?"),
        rich(strong("Future protection planned?"), " Do you know how you will protect new photos if automatic backup stays off?"),
      ],
    },
    { type: "paragraph", text: "DECODISTA recommends turning Backup off on other devices whose copies you want to preserve before changing the cloud library. If you cannot inspect a relevant device, postpone the change rather than assuming its files are safe." },
    { type: "heading", level: 2, id: "use-undo-backup", text: "How to use Undo backup on Android" },
    { type: "paragraph", text: "After the safety checks:" },
    {
      type: "list",
      style: "ordered",
      items: [
        "Open Google Photos and verify the selected account.",
        rich("Open ", strong("Profile picture → Photos settings → Backup"), "."),
        rich("Scroll to ", strong("Undo backup"), "."),
        "Read the disclosure and tick its acknowledgement only if the scope matches your intention.",
        rich("Tap ", strong("Delete Google Photos backup"), "."),
      ],
    },
    {
      type: "paragraph",
      text: rich(
        "These labels follow ",
        link("Google’s current Android instructions", "https://support.google.com/photos/answer/6128858?co=GENIE.Platform%3DAndroid&hl=en"),
        ". If your screen differs, stop at the confirmation stage and check the current help instead of guessing.",
      ),
    },
    { type: "heading", level: 2, id: "after-undo-backup", text: "What happens after Undo backup?" },
    {
      type: "paragraph",
      text: rich(
        strong("Backup switches off automatically on that device."),
        " ",
        link("Google’s Undo backup instructions", "https://support.google.com/photos/answer/6128858?co=GENIE.Platform%3DAndroid&hl=en"),
      ),
    },
    { type: "paragraph", text: "Now check the two locations independently. Use the file manager for phone files and a browser signed in to the same account for the cloud library. Do not use an unchanged photo grid as your only test." },
    { type: "paragraph", text: "Plan a replacement backup routine before relying on the phone as the home for future pictures. A phone copy that survives this operation can still be lost later through damage, theft or another deletion." },
    { type: "heading", level: 2, id: "other-devices", text: "What happens on other devices?" },
    {
      type: "paragraph",
      text: rich(
        strong("Another device using the same account with Backup on may upload the photos again."),
        " ",
        link("Google’s multi-device warning", "https://support.google.com/photos/answer/6128858?co=GENIE.Platform%3DAndroid&hl=en"),
      ),
    },
    { type: "paragraph", text: "Make a short inventory: this phone, an old phone, a tablet and any other device that holds copies. Record which account each uses and whether automatic backup is enabled." },
    { type: "paragraph", text: "Do not interpret the documented result on the phone running Undo backup as a guarantee about every local copy elsewhere. Verify each device you depend on, including one that has been offline." },
    { type: "heading", level: 2, id: "enable-backup-again", text: "What if you enable Backup again?" },
    {
      type: "paragraph",
      text: rich(
        strong("The photos can be uploaded again when Backup is re-enabled."),
        " ",
        link("Google’s Undo backup guidance", "https://support.google.com/photos/answer/6128858?co=GENIE.Platform%3DAndroid&hl=en"),
      ),
    },
    { type: "paragraph", text: "Do not switch it on merely to dismiss a reminder. First decide whether you want the pictures back in Google Photos and review the selected account and folders." },
    { type: "paragraph", text: "A replacement backup plan could mean a regular verified computer copy or another arrangement you have checked. Simply leaving automatic backup off without making another copy does not protect future photos." },
    { type: "heading", level: 2, id: "albums-sharing-locked-folder", text: "Albums, shared items and Locked Folder" },
    {
      type: "paragraph",
      text: rich(
        strong("Undo backup also removes affected items from albums, shared albums, search and memories. Device folders and Locked Folder are included."),
        " ",
        link("Google’s stated scope", "https://support.google.com/photos/answer/6128858?co=GENIE.Platform%3DAndroid&hl=en"),
      ),
    },
    { type: "paragraph", text: "Before proceeding, note any collections you care about. Keeping image files does not, by itself, preserve the arrangement of a cloud album." },
    { type: "heading", level: 3, id: "partner-sharing", text: "Partner Sharing needs a separate review" },
    {
      type: "paragraph",
      text: rich(
        "Google warns that partner auto-save may cause re-upload. ",
        link("Undo backup guidance", "https://support.google.com/photos/answer/6128858?co=GENIE.Platform%3DAndroid&hl=en"),
      ),
    },
    {
      type: "paragraph",
      text: rich(
        "Its Partner Sharing guide also says a partner’s previously saved copies survive changes to your version. Removing your cloud copy is therefore not a promise to erase someone else’s saved copy. Review both accounts with the other person before relying on the result. ",
        link("Google’s Partner Sharing guide", "https://support.google.com/photos/answer/7378858?co=GENIE.Platform%3DAndroid&hl=en"),
      ),
    },
    { type: "heading", level: 3, id: "do-not-reset-app", text: "Do not reset the app to fix this" },
    {
      type: "paragraph",
      text: rich(
        "Google warns that unbacked-up Locked Folder items can be lost when Photos is uninstalled, its app data is cleared or the device is reset. It also says locally stored Locked Folder items are not included in ordinary device-transfer routes when backup is off. Keep this limitation in mind when verifying your independent copy. ",
        link("Google’s Locked Folder precautions", "https://support.google.com/photos/answer/10694388"),
      ),
    },
    { type: "heading", level: 2, id: "undo-backup-missing", text: "What if Undo backup is missing?" },
    { type: "paragraph", text: "Check that you are using the Android Google Photos app and the intended account. Look through the full Backup settings page, and check the official app listing for an update." },
    {
      type: "paragraph",
      text: rich(
        "If the option still does not appear, pause and consult ",
        link("Google’s current Android help", "https://support.google.com/photos/answer/6128858?co=GENIE.Platform%3DAndroid&hl=en"),
        ". No universal minimum app version or fix for every missing-option case was established in this review.",
      ),
    },
    { type: "paragraph", text: "Do not substitute Delete, Delete from device or Free up space. Do not clear app data or turn Backup on solely to make the option appear." },
    { type: "paragraph", text: "Google’s selected-item removal procedure is a separate route. If that better matches your goal, read its full instructions—including the other-device and later-backup warnings—before acting. Start with disposable content after verifying independent copies." },
    { type: "heading", level: 2, id: "verification-checklist", text: "Verification checklist after the change" },
    { type: "paragraph", text: "Before making any further storage changes:" },
    {
      type: "list",
      style: "unordered",
      items: [
        rich(strong("Open phone files directly."), " Recheck the pictures and videos you intend to keep."),
        rich(strong("Check the cloud account in a browser."), " Confirm which items remain, rather than judging by a phone thumbnail."),
        rich(strong("Inspect Backup settings."), " Review this phone and every relevant second device."),
        rich(strong("Check sharing and important collections."), " Look for unintended changes and copies held elsewhere."),
        rich(strong("Keep the independent copy."), " Do not delete it because the first check looked successful."),
        rich(strong("Check storage separately."), " Compare Google Account usage with the phone’s storage reading."),
        rich(strong("Stop if anything is unexpected."), " Avoid further deletion, app resets or unreviewed sync prompts while investigating."),
      ],
    },
    {
      type: "paragraph",
      text: rich(
        "Not every cloud photo consumes quota. Google lists exceptions, including certain older uploads and some partner-shared items. Removing those items may not reduce the displayed storage usage. ",
        link("Google’s storage guide", "https://support.google.com/photos/answer/9284827?co=GENIE.Platform%3DAndroid&hl=en"),
      ),
    },
    { type: "heading", level: 2, id: "disposable-photo-test", text: "A proposed disposable-photo test" },
    {
      type: "paragraph",
      text: rich(
        strong("This workflow has not been performed by DECODISTA for this article."),
        " It is a preparation plan for readers or editors who want to observe their own setup.",
      ),
    },
    { type: "paragraph", text: "Use a spare Android device or a properly isolated test environment containing no important media. A spare Google account on a phone full of family pictures is not enough isolation." },
    {
      type: "list",
      style: "ordered",
      items: [
        "Create two clearly labelled throwaway photos and a short video.",
        "Copy them to independent storage and verify the copies.",
        "Back up the test items to the test Google account, then confirm their backup status and browser visibility.",
        "For a cloud-only control, upload a different throwaway image from a computer to the test account. Do not copy that image to the phone.",
        "Run the documented Undo backup steps only after reviewing the full test-device scope.",
        "Compare the device files, cloud library and Backup setting afterward, including what happened to the cloud-only control.",
        "If testing re-upload, enable Backup only in this disposable environment and record what you observe.",
      ],
    },
    { type: "paragraph", text: "For comparison, test Delete, Delete from device and Free up space in separate rounds with fresh expendable copies. Do not run them successively on the same only copy and assume you can identify which action caused the result." },
    {
      type: "paragraph",
      text: rich(
        "Google says Free up space may retain recent items. A new test photo remaining on the phone does not establish that the feature never removes files. ",
        link("Google’s Free up space guide", "https://support.google.com/photos/answer/6128843?co=GENIE.Platform%3DAndroid&hl=en"),
      ),
    },
    { type: "paragraph", text: "A test result applies to the recorded account, device and app version. It does not certify every Android phone." },
    { type: "heading", level: 2, id: "common-mistakes", text: "Common mistakes" },
    {
      type: "list",
      style: "unordered",
      items: [
        rich(strong("Confusing the storage counters."), " Check whether the warning concerns your Google Account or the phone."),
        rich(strong("Treating Backup off as a complete safeguard against deletion."), " Read the specific action’s disclosure."),
        rich(strong("Trusting thumbnails as originals."), " Locate the files and verify the independent copy."),
        rich(strong("Testing on important media."), " Use a separate, disposable environment."),
        rich(strong("Approving follow-up sync prompts without reading them."), " Pause if their effect is unclear."),
        rich(strong("Emptying Trash to finish the job."), " Preserve recovery options while checking the outcome."),
      ],
    },
    { type: "heading", level: 2, id: "faq", text: "FAQ" },
    { type: "heading", level: 3, id: "backup-off-delete-uploads", text: "Does turning Backup off delete photos already uploaded?" },
    { type: "paragraph", text: "No. Treat the switch as control over automatic uploading, not cloud cleanup. Check the cloud library separately before deciding on any removal." },
    { type: "heading", level: 3, id: "free-android-storage", text: "Will this free storage on my Android phone?" },
    { type: "paragraph", text: "That is the goal of Free up space or device-only removal. If your priority is retaining phone files, do not choose an action whose confirmation says it will remove them." },
    { type: "heading", level: 3, id: "already-used-free-up-space", text: "What if I already used Free up space?" },
    {
      type: "paragraph",
      text: rich(
        "Recheck the files from the beginning. Google Photos can still display backed-up pictures after their phone copies have been removed. Download and verify any independent copies you need before considering cloud deletion. ",
        link("Google’s Free up space guide", "https://support.google.com/photos/answer/6128843?co=GENIE.Platform%3DAndroid&hl=en"),
        ", ",
        link("download instructions", "https://support.google.com/photos/answer/7652919?hl=en"),
      ),
    },
    { type: "heading", level: 3, id: "trash-recovery", text: "Can I rely on Trash to reverse a mistake?" },
    {
      type: "paragraph",
      text: rich(
        "No. Check Trash promptly if something is missing, but do not use it as your backup plan. Google’s current restore guide describes a 30-day Trash period and says permanently deleted items cannot be restored. Locked Folder items cannot be moved to Trash. Do not assume every removal in this workflow has the same recovery path. ",
        link("Google’s restore guide", "https://support.google.com/photos/answer/9343482"),
        ", ",
        link("Locked Folder restrictions", "https://support.google.com/photos/answer/10694388"),
      ),
    },
    { type: "heading", level: 3, id: "storage-still-full", text: "Why is my Google storage still nearly full?" },
    {
      type: "paragraph",
      text: rich(
        "Check which account and storage category you are viewing. Google Account storage includes other services such as Gmail and Drive, and some photos do not count towards the total. Avoid deleting more pictures merely because a counter has not changed as expected. ",
        link("Google’s storage guidance", "https://support.google.com/photos/answer/9284827?co=GENIE.Platform%3DAndroid&hl=en"),
      ),
    },
    { type: "heading", level: 2, id: "sources-verification", text: "Sources and verification" },
    {
      type: "paragraph",
      text: rich(
        "Official Google documentation was checked on ",
        strong("17 September 2026 (UTC)"),
        ". Links appear beside the relevant explanations.",
      ),
    },
    { type: "paragraph", text: "This is a documentation-based Android guide. No hands-on deletion, multi-device or recovery experiment was performed. The file-verification checks and conservative stopping points are DECODISTA recommendations, not guarantees about an untested device." },
    {
      type: "paragraph",
      text: rich(
        "Related reading: ",
        link("what Google’s privacy settings actually change", "/articles/gemini-temporary-chat-vs-keep-activity-off"),
        ", and ",
        link("review apps with access to your Google Account", "/articles/remove-third-party-google-access-without-losing-login"),
        ".",
      ),
    },
  ],
};
