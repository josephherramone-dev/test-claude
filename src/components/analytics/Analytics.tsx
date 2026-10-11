"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";
import { analyticsConfig, analyticsEnabled, readConsent, writeConsent, type ConsentState } from "@/lib/analytics";

/**
 * Loads analytics scripts only after explicit consent, and shows the consent
 * banner only when an analytics provider is configured.
 */
export function Analytics() {
  const [consent, setConsent] = useState<ConsentState | "unknown">("unknown");

  useEffect(() => {
    if (!analyticsEnabled) return;
    // Reading browser storage must happen after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsent(readConsent());
    const onChange = (event: Event) => setConsent((event as CustomEvent<ConsentState>).detail);
    window.addEventListener("carla:consent", onChange);
    return () => window.removeEventListener("carla:consent", onChange);
  }, []);

  if (!analyticsEnabled) return null;

  return (
    <>
      {consent === "granted" && analyticsConfig.gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.gaId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${analyticsConfig.gaId}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {consent === "granted" && analyticsConfig.plausibleDomain && (
        <Script defer data-domain={analyticsConfig.plausibleDomain} src="https://plausible.io/js/script.js" strategy="afterInteractive" />
      )}

      {consent === null && (
        <div
          role="region"
          aria-label="Consentement à la mesure d'audience"
          className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-2xl rounded-3xl bg-ink-950 p-6 text-sm text-ink-200 shadow-2xl ring-1 ring-white/10 sm:bottom-6"
        >
          <p>
            Nous souhaitons mesurer l&apos;audience du site de façon anonyme pour l&apos;améliorer. Aucune donnée personnelle
            n&apos;est transmise dans les événements mesurés.{" "}
            <Link href="/confidentialite" className="text-white underline underline-offset-4">
              En savoir plus
            </Link>
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => writeConsent("granted")} className="h-10 rounded-full bg-carla-600 px-5 font-medium text-white hover:bg-carla-700">
              Accepter
            </button>
            <button type="button" onClick={() => writeConsent("denied")} className="h-10 rounded-full px-5 font-medium text-white ring-1 ring-white/25 hover:bg-white/10">
              Refuser
            </button>
          </div>
        </div>
      )}
    </>
  );
}
