"use client";

import { useSyncExternalStore } from "react";
import { AI_EVIDENCE_REVIEW_INTERVAL_DAYS, daysSinceEvidenceCheck } from "@/lib/ai-tools-evidence";

// Review status is a read-only snapshot of the current UTC day on page load.
// Server markup remains neutral for safe hydration; client resolves stale status.
function subscribeToSnapshot() {
  return () => {};
}

export function AiEvidenceStatus({ checkedOn }: { checkedOn: string }) {
  const isStale = useSyncExternalStore(
    subscribeToSnapshot,
    () => daysSinceEvidenceCheck(checkedOn, new Date()) > AI_EVIDENCE_REVIEW_INTERVAL_DAYS,
    () => false,
  );

  return (
    <div className={isStale ? "ai-tools-evidence-status is-stale" : "ai-tools-evidence-status"} aria-live="polite">
      <time dateTime={checkedOn}>{checkedOn}</time>
      <span aria-hidden="true">·</span>
      {isStale
        ? "Source check is over 30 days old. Recheck directly with the provider before relying on this information."
        : "Dated editorial snapshot, not live provider data. Recheck before purchasing."}
    </div>
  );
}
