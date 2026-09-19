import type { Article, InlineContent, RichText } from "@/lib/content";

const strong = (text: string): InlineContent => ({ type: "strong", text });
const link = (text: string, href: string): InlineContent => ({ type: "link", text, href });
const lineBreak: InlineContent = { type: "break" };
const rich = (...content: InlineContent[]): RichText => content;

export const doesIcloudBackupIncludePhotosArticle: Article = {
  title: "Does iCloud Backup Include Photos? It Depends on iCloud Photos",
  seoTitle: "Does iCloud Backup Include Photos? iCloud Photos Explained",
  slug: "does-icloud-backup-include-photos",
  description: "Does iCloud Backup include photos? Learn how iCloud Photos changes the answer, what deletion does, and what to check before replacing or erasing your iPhone.",
  standfirst: "Your photo recovery route depends on whether iCloud Photos is enabled. Check what is synced, what is backed up and which copies to verify before an iPhone upgrade.",
  category: "digital-life",
  tags: ["iCloud", "iCloud Photos", "iCloud Backup", "iPhone", "Photo backup", "Data protection"],
  author: "DECODISTA Editorial",
  publishedDate: "2026-09-20",
  updatedDate: "2026-09-20",
  featuredImage: "/images/icloud-backup-photos.webp",
  featuredImageAlt: "Generic smartphone photo library linked separately to a blue cloud sync layer and an amber device backup archive",
  featuredImageWidth: 1672,
  featuredImageHeight: 941,
  readingTime: 12,
  featured: true,
  sample: false,
  relatedArticleSlugs: [
    "google-photos-android-undo-backup-keep-phone-photos",
    "google-authenticator-new-phone-codes-missing",
  ],
  content: [
    {
      type: "paragraph",
      text: rich(
        strong("DECODISTA — Technology, Decoded."),
        lineBreak,
        strong("Category: Digital Life"),
        lineBreak,
        strong("Information checked on: 18 September 2026 (UTC)"),
      ),
    },
    {
      type: "paragraph",
      text: rich(
        strong("If iCloud Photos is on, your synced photos are stored in iCloud Photos and are not duplicated inside your normal iCloud device backup. If iCloud Photos is off, iCloud Backup may include the photos and videos stored on your iPhone."),
        " Inclusion depends on your backup settings and a successful backup. ",
        link("Apple’s explanation of backup contents", "https://support.apple.com/en-us/108770"),
        ", ",
        link("photo-library backup controls", "https://support.apple.com/en-us/108922"),
      ),
    },
    { type: "paragraph", text: "That means replacing a phone and recovering an accidentally deleted photo are different problems. Before relying on either service, check which copies actually exist." },
    { type: "heading", level: 2, id: "key-takeaways", text: "Key takeaways" },
    {
      type: "list",
      style: "unordered",
      items: [
        rich("Check ", strong("iCloud Photos"), " and ", strong("iCloud Backup"), " separately."),
        "A photo visible on your phone is not proof that its original has finished uploading or downloading.",
        "Sync can help after device loss, but it can also carry a deletion to your other devices.",
        "Keep an independent archive of irreplaceable pictures before cleanup or a phone reset.",
      ],
    },
    {
      type: "callout",
      title: "Before deleting, clearing storage or erasing a phone:",
      text: "Verify the copies you depend on. Open important exported files from their destination and check recent uploads or the completed backup. Do not delete valuable photos to test whether another copy survives.",
    },
    { type: "heading", level: 2, id: "icloud-photos-on-vs-off", text: "iCloud Photos on vs off" },
    {
      type: "table",
      headers: ["Question", "iCloud Photos ON", "iCloud Photos OFF"],
      rows: [
        ["Where is the cloud photo collection?", "In iCloud Photos, once uploads finish", "Eligible on-device photos may be inside a completed device backup"],
        ["Are those photos also duplicated in normal iCloud Backup?", "No", "They can be included; check the device’s Photo Library backup setting"],
        ["How do photos return after replacement?", "Through photo sync with the same Apple Account", "Through restoration of a backup that contains them, or another verified transfer"],
        ["What should you verify first?", "Sync status and actual cloud contents", "Photo inclusion and the last successful backup"],
        ["Does this create an independent archive?", "No", "A device backup is a restore resource; do not treat it as a permanent photo archive"],
      ],
    },
    {
      type: "paragraph",
      text: rich(
        "The distinction comes from Apple’s ",
        link("backup-contents documentation", "https://support.apple.com/en-us/108770"),
        " and ",
        link("guidance on photos after restoration", "https://support.apple.com/en-us/102325"),
        ". The practical checks are DECODISTA recommendations.",
      ),
    },
    { type: "heading", level: 2, id: "photos-vs-backup", text: "What iCloud Photos does—and what iCloud Backup does" },
    {
      type: "paragraph",
      text: rich(
        strong("iCloud Photos"),
        " maintains a photo library across your devices. It stores originals at full resolution in iCloud, while changes made in Photos are synchronised. Uploading takes time, so enabling the feature is not the same as completing an upload. ",
        link("Apple’s iCloud Photos guide", "https://support.apple.com/en-us/108782"),
      ),
    },
    {
      type: "paragraph",
      text: rich(
        strong("iCloud Backup"),
        " makes a restorable copy of eligible device information, such as settings and data that are not already synchronised to iCloud. It does not create another copy of the synced photo library. ",
        link("Apple’s backup explanation", "https://support.apple.com/en-us/108770"),
      ),
    },
    { type: "paragraph", text: "The relationship is:" },
    {
      type: "list",
      style: "unordered",
      items: [
        rich(strong("Photos ON:"), " iPhone photo library ↔ iCloud Photos. ", strong("iCloud Backup stores other eligible device data; synced photos are excluded.")),
        rich(strong("Photos OFF:"), " eligible local iPhone photos → completed iCloud device backup, when included."),
        rich(strong("Independent archive:"), " exported photo files → a separate computer or external drive outside the active synced library."),
      ],
    },
    { type: "paragraph", text: "There is no extra photo-backup stage at the end of “iPhone → iCloud Photos → iCloud Backup”." },
    { type: "heading", level: 2, id: "deleting-a-photo", text: "What happens when you delete a photo?" },
    {
      type: "paragraph",
      text: rich(
        "With iCloud Photos enabled, deleting an item in Photos also removes it from iCloud Photos and other devices using that synced library. Having a Mac or iPad connected to the same library does not, by itself, preserve a separate copy. ",
        link("Apple’s deletion guidance", "https://support.apple.com/en-us/104967"),
      ),
    },
    {
      type: "paragraph",
      text: rich(
        "The usual recovery route is ",
        strong("Recently Deleted"),
        ", where items are normally recoverable for 30 days. Permanently deleting them there removes that recovery option. ",
        link("Apple’s recovery and deletion instructions", "https://support.apple.com/en-us/104967"),
      ),
    },
    {
      type: "paragraph",
      text: rich(
        strong("Important exception:"),
        " Apple’s current storage-management page says that if you exceed your iCloud storage limit, deleted photos and videos are removed immediately and are unavailable in Recently Deleted. Do not rely on a guaranteed 30-day safety window when cleaning up an over-limit account. ",
        link("Apple’s storage warning", "https://support.apple.com/en-us/108922"),
      ),
    },
    {
      type: "paragraph",
      text: rich(
        "If iCloud Photos was off when a particular backup was made, that backup might contain an earlier photo. Its contents and availability still need verification. ",
        strong("Do not erase your current phone to investigate an old backup without first protecting its current data."),
        " Apple likewise advises backing up current data before trying another restoration. ",
        link("Apple’s missing-data guidance", "https://support.apple.com/en-us/102325"),
      ),
    },
    { type: "paragraph", text: "For synced photos, a successful device-backup message should never be your reason for assuming deletion is safe." },
    { type: "heading", level: 2, id: "optimize-vs-originals", text: "Optimize iPhone Storage vs Download and Keep Originals" },
    {
      type: "table",
      headers: ["Setting", "What it does", "What it does not establish"],
      rows: [
        [rich(strong("Optimize iPhone Storage")), "Lets the phone use smaller local versions when space is needed; full-resolution originals remain in iCloud Photos", "That every original is available locally, especially offline"],
        [rich(strong("Download and Keep Originals")), "Requests full-resolution copies on the iPhone as well as in iCloud", "That downloading is finished, or that the copies are independent of library sync"],
      ],
    },
    {
      type: "paragraph",
      text: rich(
        "These storage options are documented in Apple’s ",
        link("photo-storage guide", "https://support.apple.com/en-us/105061"),
        " and ",
        link("archive instructions", "https://support.apple.com/en-us/108306"),
        ".",
      ),
    },
    { type: "paragraph", text: rich(strong("DECODISTA recommendation:"), " For phone-space pressure, consider optimisation after checking uploads. Allow enough device capacity and download time if you need local originals. Neither choice should replace an independent archive.") },
    { type: "paragraph", text: "Changing this storage preference does not turn the iPhone’s Photos library into a separate collection immune to synced deletions." },
    { type: "heading", level: 2, id: "protection-comparison", text: "What protects against what?" },
    { type: "paragraph", text: "This is DECODISTA’s practical interpretation of the documented behaviour. “Independent archive” means verified exported files stored separately, without automatically mirroring deletions from Photos." },
    {
      type: "table",
      headers: ["Situation", "iCloud Photos", "Device backup with photos included", "Independent archive"],
      rows: [
        ["Phone lost, damaged or erased", "Can supply photos already uploaded, provided you regain account access", "Can restore photos actually present in that backup", "Can supply the files you exported"],
        ["Photo deleted accidentally", "Deletion syncs; recovery has the limits described above", "An earlier copy may help, but do not assume it exists or remains available", "Can preserve an exported copy if the archive itself was not changed"],
        ["Recent photos never uploaded or backed up", "Does not establish a cloud copy of those items", "Does not establish a copy of items absent from the backup", "Helps only if those items were exported"],
        ["You want a fixed collection before cleanup", "The active library continues changing", "Check the particular backup; it is not a guaranteed permanent archive", "A dated, verified export is suited to this purpose"],
      ],
    },
    { type: "paragraph", text: "No single “on” switch proves that all your pictures are recoverable." },
    { type: "heading", level: 2, id: "new-iphone", text: "What happens when you move to a new iPhone?" },
    { type: "heading", level: 3, id: "new-iphone-with-photos", text: "If you use iCloud Photos" },
    {
      type: "paragraph",
      text: rich(
        "Sign in to the same Apple Account and enable iCloud Photos. Your cloud library becomes available through Photos. It comes from the sync service, even if you also restored the phone’s settings and other data from a device backup. ",
        link("Apple’s photo-access instructions", "https://support.apple.com/en-us/111762"),
      ),
    },
    {
      type: "paragraph",
      text: rich(
        "Keep the phone connected while the library loads. Photos can continue downloading after the initial device restoration. ",
        link("Apple’s explanation of photos after restoration", "https://support.apple.com/en-us/102325"),
      ),
    },
    { type: "heading", level: 3, id: "new-iphone-without-photos", text: "If you do not use iCloud Photos" },
    {
      type: "paragraph",
      text: rich(
        "Use a completed backup that includes the pictures, or a verified transfer from the old phone. During iPhone setup, Apple’s iCloud restoration flow lets you choose a backup by date and size. Content can continue restoring in the background. ",
        link("Apple’s restoration instructions", "https://support.apple.com/en-us/118105"),
      ),
    },
    { type: "paragraph", text: "A backup made before an important event cannot establish that the event’s later photos were saved. Check dates, then inspect the new phone before retiring the old one." },
    { type: "heading", level: 3, id: "erase-vs-delete", text: "Erasing the old phone is different from deleting its photos" },
    {
      type: "paragraph",
      text: rich(
        "Apple says ",
        strong("Erase All Content and Settings"),
        " removes the device’s content without deleting content already in iCloud. Manually deleting synced photos is different: it changes the cloud library too. Follow Apple’s handover procedure only after verifying your copies and the new phone. ",
        link("Apple’s pre-sale and trade-in guidance", "https://support.apple.com/en-us/109511"),
      ),
    },
    { type: "paragraph", text: "Photos that never left the old phone still need protection before erasure." },
    { type: "heading", level: 2, id: "check-setup", text: "How to check your current setup" },
    { type: "paragraph", text: "Start with observation. Do not toggle sync off simply to see what happens." },
    { type: "heading", level: 3, id: "check-photo-sync", text: "1. Check photo sync and local storage" },
    { type: "paragraph", text: rich("Open ", strong("Settings → your name → iCloud → Photos"), " and check the switch for syncing this iPhone.") },
    {
      type: "paragraph",
      text: rich(
        "Apple’s current instructions put the storage choices under ",
        strong("iPhone Storage"),
        " on iOS 27 or later. On iOS 26 or earlier, the optimisation option appears directly in the Photos settings. Check whether you use optimisation or downloaded originals. ",
        link("Apple’s current Photos settings", "https://support.apple.com/en-us/108782"),
        ", ",
        link("storage settings", "https://support.apple.com/en-us/105061"),
      ),
    },
    { type: "heading", level: 3, id: "check-sync-status", text: "2. Check whether syncing has finished" },
    {
      type: "paragraph",
      text: rich(
        "On the current Photos interface, open ",
        strong("Collections"),
        ", then the profile button, and read the library status. A pause, storage warning or upload problem needs attention. Apple advises against turning iCloud Photos off as a sync fix. ",
        link("Apple’s sync-status guidance", "https://support.apple.com/en-us/101559"),
      ),
    },
    {
      type: "paragraph",
      text: rich(
        strong("DECODISTA recommendation:"),
        " Also inspect recent and important pictures at ",
        link("iCloud Photos on the web", "https://www.icloud.com/photos/"),
        " or another trusted synced device. Open several photos and play videos. A sample is a useful check, not proof that every item is present.",
      ),
    },
    { type: "heading", level: 3, id: "check-device-backup", text: "3. Check the device backup" },
    {
      type: "paragraph",
      text: rich(
        "Open ",
        strong("Settings → your name → iCloud → iCloud Backup"),
        ". Check the last completed backup date. If you need a fresh backup, use ",
        strong("Back Up Now"),
        " on Wi-Fi and wait for completion. ",
        link("Apple’s backup instructions", "https://support.apple.com/en-us/108366"),
      ),
    },
    {
      type: "paragraph",
      text: rich(
        "With iCloud Photos off, inspect ",
        strong("iCloud → Storage"),
        " or ",
        strong("Manage Account Storage → Backups → this iPhone → Photo Library"),
        " to check its backup inclusion. ",
        link("Apple’s photo-library backup controls", "https://support.apple.com/en-us/108922"),
      ),
    },
    { type: "paragraph", text: "A completed device backup and completed photo sync are separate checks." },
    { type: "heading", level: 2, id: "independent-archive", text: "How to create an independent photo archive" },
    { type: "paragraph", text: "The goal is a copy you can open outside the live Photos library." },
    { type: "heading", level: 3, id: "download-to-computer", text: "A straightforward option: download to a computer" },
    {
      type: "list",
      style: "ordered",
      items: [
        rich("On your computer, sign in to ", link("iCloud Photos", "https://www.icloud.com/photos/"), "."),
        "Select the photos and videos you want to preserve.",
        rich("Use the download options. Choose ", strong("Unmodified Originals"), " when you want the files as captured or imported."),
        "Save the downloaded files to a clearly named local folder, then copy that folder to an external drive.",
      ],
    },
    {
      type: "paragraph",
      text: rich(
        "Apple documents browser downloads and their available formats. ",
        link("Apple’s download guide", "https://support.apple.com/en-us/111762"),
      ),
    },
    {
      type: "paragraph",
      text: rich(
        "For an iPhone-to-drive route, Apple also documents downloading originals and exporting selected items to connected external storage. On a Mac, its archive guide describes exporting from Photos. ",
        link("Apple’s archive instructions", "https://support.apple.com/en-us/108306"),
      ),
    },
    { type: "heading", level: 3, id: "verify-archive", text: "Verify the archive before relying on it" },
    { type: "paragraph", text: rich(strong("DECODISTA recommendations:")) },
    {
      type: "list",
      style: "unordered",
      items: [
        "Choose an actual local or external destination. Check that you have not simply saved into iCloud Drive by default.",
        "Open files from that destination with the network disconnected. Play exported videos as well as opening photos.",
        "Review the expected date range and look for failed or missing downloads.",
        "If edits matter, preserve and inspect an edited version as well as the original.",
        "Keep a second archive copy for irreplaceable material, preferably stored separately.",
        "Record the export date and scope. Update the archive as new pictures arrive.",
      ],
    },
    { type: "paragraph", text: "An exported folder is not a promise to preserve the complete Photos experience, including every album, edit history or sharing feature. Decide whether you need the image files, the edited results or a fuller library backup before starting a large export." },
    {
      type: "paragraph",
      text: rich(
        "For Android and Google Photos—not Apple Photos—see how to ",
        link("understand cloud and device copies in Google Photos", "/articles/google-photos-android-undo-backup-keep-phone-photos"),
        ".",
      ),
    },
    { type: "heading", level: 2, id: "pre-cleanup-checklist", text: "Pre-cleanup and pre-upgrade checklist" },
    {
      type: "list",
      style: "unordered",
      items: [
        "☐ I know whether iCloud Photos is on.",
        "☐ I checked sync status and resolved outstanding warnings.",
        "☐ If I rely on device backup for photos, I checked photo inclusion and a completed backup date.",
        "☐ I can access the Apple Account and its verification methods during the move.",
        "☐ I exported irreplaceable items and opened the resulting files independently.",
        "☐ I checked recent and older photos, and played important videos on the destination.",
        "☐ I will keep the old phone intact until the new setup is verified.",
        "☐ I will use Apple’s handover procedure rather than manually deleting the synced library.",
      ],
    },
    {
      type: "paragraph",
      text: rich(
        "If the move also affects two-factor authentication, ",
        link("verify your authenticator before retiring a phone", "/articles/google-authenticator-new-phone-codes-missing"),
        ".",
      ),
    },
    { type: "paragraph", text: "If a check fails, stop the cleanup and resolve it first." },
    { type: "heading", level: 2, id: "common-mistakes", text: "Common mistakes" },
    {
      type: "list",
      style: "unordered",
      items: [
        rich(strong("Seeing two iCloud switches and assuming two photo backups."), " Check what each service contains."),
        rich(strong("Treating thumbnails as proof of local originals."), " Verify actual downloads."),
        rich(strong("Deleting pictures to free phone space while expecting them to remain in iCloud Photos."), " Consider the local storage setting instead."),
        rich(strong("Assuming downloaded originals cannot be deleted through sync."), " Export a separate archive."),
        rich(strong("Testing with family photos."), " Use a disposable image only."),
        rich(strong("Changing sync settings immediately before a reset."), " Establish and verify the intended recovery route first."),
      ],
    },
    { type: "heading", level: 2, id: "faq", text: "FAQ" },
    { type: "heading", level: 3, id: "photos-off", text: "Does iCloud Backup include photos if iCloud Photos is off?" },
    { type: "paragraph", text: "It may include eligible photos stored on the device. Check Photo Library inclusion and confirm that the backup completed." },
    { type: "heading", level: 3, id: "deleted-photo-backup", text: "Can I recover a deleted synced photo from an old device backup?" },
    { type: "paragraph", text: "Do not assume so. Check Recently Deleted promptly, then any independent archives. The normal synced setup does not create a second photo copy inside device backup." },
    { type: "heading", level: 3, id: "lost-iphone", text: "Will my photos survive losing my iPhone?" },
    { type: "paragraph", text: "Photos already uploaded to iCloud Photos, included in an available backup or exported separately provide recovery routes. A picture stored only on the lost phone has no verified second copy through those routes." },
    { type: "heading", level: 3, id: "optimization-quality", text: "Does optimisation reduce the quality of the cloud originals?" },
    {
      type: "paragraph",
      text: rich(
        "No. The space-saving versions are for device storage; iCloud Photos keeps the originals at full resolution. ",
        link("Apple’s storage explanation", "https://support.apple.com/en-us/105061"),
      ),
    },
    { type: "heading", level: 3, id: "downloaded-originals-backup", text: "Does Download and Keep Originals make a separate backup?" },
    { type: "paragraph", text: "No. It changes local storage within the synced setup. Use the archive workflow for a separate copy." },
    { type: "heading", level: 2, id: "sources-verification", text: "Sources and verification" },
    { type: "paragraph", text: rich("Checked on ", strong("18 September 2026 (UTC)"), " against current Apple Support documentation. The links throughout the article support the product behaviour; the checklists and archive-verification advice are DECODISTA recommendations.") },
    { type: "paragraph", text: "This article is based on documentation review. No device migration, deletion or restoration test was performed, and no screenshots are presented as captured evidence." },
  ],
};
