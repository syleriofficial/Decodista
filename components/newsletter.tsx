"use client";

import { FormEvent, useState } from "react";

export function Newsletter() {
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("Newsletter sign-up is not connected yet. No email was sent or saved.");
  };

  return (
    <section className="newsletter" aria-labelledby="newsletter-title">
      <div>
        <span className="eyebrow">The clear signal</span>
        <h2 id="newsletter-title">Technology, minus the noise.</h2>
        <p>A concise weekly guide to the ideas and tools worth understanding.</p>
      </div>
      <form onSubmit={handleSubmit} aria-describedby="newsletter-note newsletter-status">
        <label className="sr-only" htmlFor="newsletter-email">Email address</label>
        <div className="newsletter-row">
          <input id="newsletter-email" type="email" placeholder="you@example.com" required />
          <button type="submit">Notify me</button>
        </div>
        <p id="newsletter-note" className="form-note">Preview only. No email provider is connected.</p>
        <p id="newsletter-status" className="form-status" aria-live="polite">{message}</p>
      </form>
    </section>
  );
}
