import type { AnchorHTMLAttributes } from "react";

type AppLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
};

/**
 * Use native navigation until vinext's production link shim can prefetch and
 * navigate without runtime errors.
 */
export default function AppLink({ href, ...props }: AppLinkProps) {
  return <a href={href} {...props} />;
}
