import type { Metadata } from "next";
import Link from "@/components/app-link";
import { ContactForm } from "@/components/contact-form";
import { TURNSTILE_SITE_KEY } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Send an editorial, correction, accessibility or general enquiry to DECODISTA.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact DECODISTA",
    description: "Send an editorial, correction, accessibility or general enquiry to DECODISTA.",
    url: "/contact",
  },
  twitter: {
    card: "summary",
    title: "Contact DECODISTA",
    description: "Send an editorial, correction, accessibility or general enquiry to DECODISTA.",
  },
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const query = await searchParams;
  const initialEnquiryType = query.type === "correction" ? "Correction" : "General enquiry";

  return (
    <main id="main-content" className="contact-page wrap">
      <header className="page-intro">
        <span className="eyebrow">Reach DECODISTA</span>
        <h1>Contact</h1>
        <p>Send an editorial question, correction, factual update, accessibility report or general enquiry.</p>
      </header>

      <div className="contact-layout">
        <section aria-labelledby="contact-form-heading">
          <h2 id="contact-form-heading">Send a message</h2>
          <p className="contact-lede">Required fields are validated securely. The private delivery address is never shown on this website.</p>
          <ContactForm siteKey={TURNSTILE_SITE_KEY} initialEnquiryType={initialEnquiryType} />
        </section>

        <aside className="contact-guidance" aria-labelledby="contact-security-heading">
          <section>
            <h2 id="contact-security-heading">Keep account secrets out</h2>
            <p>Do not submit passwords, OTPs, two-factor authentication codes, authenticator QR codes, recovery keys, backup codes, API keys, session tokens, private keys, payment-card information or other account secrets.</p>
          </section>
          <section>
            <h2>Privacy</h2>
            <p>Your submitted information is used to review and, where appropriate, respond to your enquiry. Read the <Link href="/privacy-policy">Privacy Policy</Link>.</p>
          </section>
          <section>
            <h2>Corrections</h2>
            <p>For a correction, include the article URL, the disputed statement, a concise explanation and a credible supporting source when available.</p>
            <Link className="contact-inline-link" href="/corrections">Read the Corrections policy</Link>
          </section>
        </aside>
      </div>
    </main>
  );
}
