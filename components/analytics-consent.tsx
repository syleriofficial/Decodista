"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "@/components/app-link";

const CONSENT_STORAGE_KEY = "decodista-analytics-consent";
const OPEN_PREFERENCES_EVENT = "decodista:open-analytics-preferences";

type ConsentChoice = "granted" | "denied";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function updateGoogleConsent(choice: ConsentChoice) {
  window.gtag?.("consent", "update", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: choice,
  });
}

export function AnalyticsConsent({ measurementId }: { measurementId: string }) {
  const [choice, setChoice] = useState<ConsentChoice | null | "loading">("loading");
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const configuredRef = useRef(false);

  useEffect(() => {
    const savedChoice = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    const frame = window.requestAnimationFrame(() => {
      setChoice(savedChoice === "granted" || savedChoice === "denied" ? savedChoice : null);
    });

    const openPreferences = () => setPreferencesOpen(true);
    window.addEventListener(OPEN_PREFERENCES_EVENT, openPreferences);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener(OPEN_PREFERENCES_EVENT, openPreferences);
    };
  }, []);

  useEffect(() => {
    if (choice === null || preferencesOpen) dialogRef.current?.focus();
  }, [choice, preferencesOpen]);

  const saveChoice = useCallback((nextChoice: ConsentChoice) => {
    const isWithdrawal = choice === "granted" && nextChoice === "denied";
    window.localStorage.setItem(CONSENT_STORAGE_KEY, nextChoice);
    updateGoogleConsent(nextChoice);
    if (isWithdrawal) {
      window.location.reload();
      return;
    }
    setChoice(nextChoice);
    setPreferencesOpen(false);
  }, [choice]);

  const configureAnalytics = useCallback(() => {
    if (configuredRef.current) return;
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    configuredRef.current = true;
  }, [measurementId]);

  const showDialog = choice === null || preferencesOpen;

  return (
    <>
      {choice === "granted" && (
        <Script
          id="google-analytics"
          src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
          strategy="afterInteractive"
          onReady={configureAnalytics}
        />
      )}
      {showDialog && (
        <div className="consent-banner" role="dialog" aria-modal="false" aria-labelledby="consent-title" aria-describedby="consent-description" ref={dialogRef} tabIndex={-1}>
          <div>
            <strong id="consent-title">Your privacy choices</strong>
            <p id="consent-description">DECODISTA uses optional Google Analytics to understand readership. Analytics stays off unless you accept. Advertising storage and personalisation remain disabled.</p>
            <Link href="/privacy-policy">Read the privacy policy</Link>
          </div>
          <div className="consent-actions">
            <button type="button" onClick={() => saveChoice("denied")}>Decline analytics</button>
            <button className="consent-accept" type="button" onClick={() => saveChoice("granted")}>Accept analytics</button>
          </div>
        </div>
      )}
    </>
  );
}

export function PrivacyChoicesButton() {
  return <button className="privacy-choices-button" type="button" onClick={() => window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT))}>Privacy choices</button>;
}
