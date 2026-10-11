"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { bookingConfig } from "@/config/booking";
import { BookingFallback } from "./BookingFallback";

type State = "loading" | "ready" | "failed";

/**
 * Markoub.ma iframe — rendered only when a verified, embeddable URL is
 * configured. If the frame has not loaded before the timeout, the fallback
 * panel replaces it, so visitors never face an empty frame. A permanent
 * external link is shown below the frame as well, because a browser that
 * blocks framing (X-Frame-Options / CSP) cannot always be detected.
 */
export function BookingEmbed({ src }: { src: string }) {
  const [state, setState] = useState<State>("loading");

  useEffect(() => {
    if (state !== "loading") return;
    const timer = window.setTimeout(() => setState("failed"), bookingConfig.embedTimeoutMs);
    return () => window.clearTimeout(timer);
  }, [state]);

  if (state === "failed") return <BookingFallback reason="embed-failed" />;

  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl">
        {state === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink-900 text-ink-300" role="status">
            <Loader2 aria-hidden className="size-6 animate-spin text-carla-300" />
            Chargement du module de réservation {bookingConfig.partnerName}…
          </div>
        )}
        <iframe
          src={src}
          title={`Réservation de billets sur ${bookingConfig.partnerName}`}
          className="block h-[720px] w-full"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
          onLoad={() => setState("ready")}
          onError={() => setState("failed")}
        />
      </div>
      <p className="mt-4 text-center text-sm text-ink-300">
        Le module ne s&apos;affiche pas correctement ?{" "}
        <a
          href={bookingConfig.partnerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-carla-300 underline underline-offset-4 hover:text-white"
        >
          Réserver directement sur {bookingConfig.partnerName}
          <span className="sr-only"> (s&apos;ouvre dans un nouvel onglet)</span>
        </a>
      </p>
    </div>
  );
}
