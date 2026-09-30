"use client";

import Script from "next/script";
import { FormEvent, useRef, useState } from "react";

const ENQUIRY_TYPES = [
  "Editorial enquiry",
  "Correction",
  "Source or factual update",
  "Accessibility issue",
  "General enquiry",
] as const;

type FieldName = "name" | "email" | "enquiryType" | "subject" | "message" | "articleUrl" | "turnstileToken";
type FieldErrors = Partial<Record<FieldName, string>>;

declare global {
  interface Window {
    turnstile?: { reset: (widget?: string | HTMLElement) => void };
  }
}

function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return <p className="field-error" id={id}>{message}</p>;
}

export function ContactForm({ siteKey, initialEnquiryType }: { siteKey: string; initialEnquiryType: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [enquiryType, setEnquiryType] = useState(initialEnquiryType);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<{ kind: "idle" | "sending" | "success" | "error"; message?: string }>({ kind: "idle" });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.kind === "sending") return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const payload = {
      name: values.get("name"),
      email: values.get("email"),
      enquiryType: values.get("enquiryType"),
      subject: values.get("subject"),
      message: values.get("message"),
      articleUrl: values.get("articleUrl"),
      turnstileToken: values.get("cf-turnstile-response"),
    };

    setErrors({});
    setStatus({ kind: "sending" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as { ok?: boolean; message?: string; errors?: FieldErrors };
      if (!response.ok || result.ok !== true) {
        setErrors(result.errors ?? {});
        setStatus({ kind: "error", message: result.message ?? "Your message could not be sent. Please try again." });
        window.turnstile?.reset();
        return;
      }
      form.reset();
      setEnquiryType("General enquiry");
      setStatus({ kind: "success", message: result.message ?? "Your message was sent." });
      window.turnstile?.reset();
    } catch {
      setStatus({ kind: "error", message: "Your message could not be sent. Check your connection and try again." });
      window.turnstile?.reset();
    }
  }

  const describedBy = (field: FieldName, hint?: string) => [hint, errors[field] ? `${field}-error` : ""].filter(Boolean).join(" ") || undefined;

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      <form ref={formRef} className="contact-form" onSubmit={submit} noValidate>
        <div className="contact-form-grid">
          <div className="form-field">
            <label htmlFor="contact-name">Name</label>
            <input id="contact-name" name="name" autoComplete="name" minLength={2} maxLength={100} required aria-invalid={Boolean(errors.name)} aria-describedby={describedBy("name")} />
            <ErrorText id="name-error" message={errors.name} />
          </div>
          <div className="form-field">
            <label htmlFor="contact-email">Email</label>
            <input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} required aria-invalid={Boolean(errors.email)} aria-describedby={describedBy("email", "email-hint")} />
            <p className="field-hint" id="email-hint">Used only to review or respond to this enquiry.</p>
            <ErrorText id="email-error" message={errors.email} />
          </div>
          <div className="form-field form-field--wide">
            <label htmlFor="contact-type">Enquiry type</label>
            <select id="contact-type" name="enquiryType" value={enquiryType} onChange={(event) => setEnquiryType(event.target.value)} required aria-invalid={Boolean(errors.enquiryType)} aria-describedby={describedBy("enquiryType")}>
              {ENQUIRY_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
            <ErrorText id="enquiryType-error" message={errors.enquiryType} />
          </div>
          {enquiryType === "Correction" && (
            <div className="form-field form-field--wide">
              <label htmlFor="contact-article-url">Article URL <span>(optional)</span></label>
              <input id="contact-article-url" name="articleUrl" type="url" inputMode="url" placeholder="https://decodista.com/articles/..." maxLength={500} aria-invalid={Boolean(errors.articleUrl)} aria-describedby={describedBy("articleUrl", "article-url-hint")} />
              <p className="field-hint" id="article-url-hint">Include the DECODISTA page related to the correction.</p>
              <ErrorText id="articleUrl-error" message={errors.articleUrl} />
            </div>
          )}
          <div className="form-field form-field--wide">
            <label htmlFor="contact-subject">Subject</label>
            <input id="contact-subject" name="subject" minLength={3} maxLength={160} required aria-invalid={Boolean(errors.subject)} aria-describedby={describedBy("subject")} />
            <ErrorText id="subject-error" message={errors.subject} />
          </div>
          <div className="form-field form-field--wide">
            <label htmlFor="contact-message">Message</label>
            <textarea id="contact-message" name="message" rows={10} minLength={10} maxLength={5000} required aria-invalid={Boolean(errors.message)} aria-describedby={describedBy("message", "message-hint")} />
            <p className="field-hint" id="message-hint">10–5000 characters. For corrections, identify the disputed statement, explain the issue and include a credible source when available.</p>
            <ErrorText id="message-error" message={errors.message} />
          </div>
        </div>

        <div className="turnstile-wrap" aria-describedby={errors.turnstileToken ? "turnstileToken-error" : undefined}>
          <div className="cf-turnstile" data-sitekey={siteKey} data-action="contact" data-theme="auto" data-size="flexible" />
          <ErrorText id="turnstileToken-error" message={errors.turnstileToken} />
        </div>

        {status.kind !== "idle" && (
          <p className={`form-status form-status--${status.kind}`} role={status.kind === "error" ? "alert" : "status"} aria-live="polite">
            {status.kind === "sending" ? "Sending securely…" : status.message}
          </p>
        )}

        <button className="contact-submit" type="submit" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Sending…" : "Send message"}
        </button>
      </form>
    </>
  );
}
