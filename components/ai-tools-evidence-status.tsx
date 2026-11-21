"use client";

import { useEffect, useState } from "react";
import { AI_EVIDENCE_REVIEW_INTERVAL_DAYS, daysSinceEvidenceCheck } from "@/lib/ai-tools-evidence";

type ReviewState = "pending" | "fresh" | "stale";

export function AiEvidenceStatus({ checkedOn }: { checkedOn: string }) {
  const [state, setState] = useState<ReviewState>("pending");

  useEffect(() => {
    const age = daysSinceEvidenceCheck(checkedOn, new Date());
    setState(age <= AI_EVIDENCE_REVIEW_INTERVAL_DAYS ? "fresh" : "stale");
  }, [checkedOn]);

  return (
    <div className={state === "stale" ? "ai-tools-evidence-status is-stale" : "ai-tools-evidence-status"} aria-live="polite">
      <time dateTime={checkedOn}>{checkedOn}</time>
      <span aria-hidden="true">·</span>
      {state === "stale"
        ? "Source check is over 30 days old. Recheck directly with the provider before relying on this information."
        : "Dated editorial snapshot, not live provider data. Recheck before purchasing."}
    </div>
  );
}
