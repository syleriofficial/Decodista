import type { AnchorHTMLAttributes, ReactNode } from "react";

/**
 * Deliberately inactive insertion points for a future approved ad provider.
 * These render nothing: no empty boxes, ad requests, tracking, or layout shift.
 *
 * Before activation implement provider loading, region-aware consent, placement
 * review, responsive sizing, and production QA in this shared component.
 */
export type PlannedAdPlacement =
  | "home-after-latest"
  | "article-after-opening"
  | "article-after-body"
  | "category-after-lead";

export function FutureAdPlacement({ placement }: { placement: PlannedAdPlacement }) {
  void placement;
  return null;
}

type AffiliateLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "rel" | "target"
> & {
  href: string;
  children: ReactNode;
};

/**
 * Use only for verified commercial outbound links, and pair with a visible
 * AffiliateDisclosure on the same page near the relevant recommendation.
 */
export function AffiliateLink({ href, children, ...props }: AffiliateLinkProps) {
  return (
    <a {...props} href={href} target="_blank" rel="sponsored noopener noreferrer">
      {children}
    </a>
  );
}

/** Render only on pages that actually contain compensated affiliate links. */
export function AffiliateDisclosure() {
  return (
    <aside className="commercial-disclosure" aria-label="Affiliate disclosure">
      <strong>Affiliate disclosure</strong>
      <p>
        DECODISTA may earn a commission if you buy through links identified
        as affiliate links. This does not change the price you pay or our
        obligation to explain how a recommendation was reached.
      </p>
    </aside>
  );
}

/** Render only for genuinely commissioned, clearly separated paid content. */
export function SponsoredContentDisclosure({ sponsor }: { sponsor: string }) {
  return (
    <aside className="commercial-disclosure" aria-label="Sponsored content disclosure">
      <strong>Sponsored content · Paid partnership</strong>
      <p>Supported by {sponsor}. This is paid content, not an independent review.</p>
    </aside>
  );
}
