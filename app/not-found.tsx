import type { Metadata } from "next";
import Link from "@/components/app-link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The requested DECODISTA page could not be found.",
  alternates: null,
  openGraph: null,
  twitter: null,
  robots: {
    index: false,
    follow: true,
    nocache: true,
  },
};

export default function NotFound() { return <main id="main-content" className="not-found wrap"><span className="eyebrow">404 / Signal lost</span><h1>We couldn’t decode that page.</h1><p>The address may have changed, or the page may not exist.</p><Link href="/">Return to the homepage</Link></main>; }
