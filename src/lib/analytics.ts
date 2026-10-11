/**
 * Consent-aware analytics.
 *
 * Disabled unless NEXT_PUBLIC_GA_MEASUREMENT_ID and/or NEXT_PUBLIC_PLAUSIBLE_DOMAIN
 * are set AND the visitor accepted measurement in the consent banner.
 * Events never contain personal data (no names, e-mails, phone numbers or
 * free-text messages) — only coarse, non-identifying properties.
 */
export type AnalyticsEvent =
  | "booking_cta_click"
  | "markoub_outbound_click"
  | "route_search"
  | "agency_directions_click"
  | "contact_form_submit"
  | "training_inquiry_submit"
  | "chatbot_open"
  | "chatbot_message"
  | "chatbot_quick_action";

type EventProps = Record<string, string | number | boolean | undefined>;

export const analyticsConfig = {
  gaId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || null,
  plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || null,
};

export const analyticsEnabled = Boolean(analyticsConfig.gaId || analyticsConfig.plausibleDomain);

export const CONSENT_KEY = "carla-analytics-consent";
export type ConsentState = "granted" | "denied" | null;

export function readConsent(): ConsentState {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function writeConsent(value: "granted" | "denied"): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* storage unavailable: consent applies to this page view only */
  }
  window.dispatchEvent(new CustomEvent("carla:consent", { detail: value }));
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, options?: { props?: EventProps }) => void;
  }
}

export function track(event: AnalyticsEvent, props: EventProps = {}): void {
  if (typeof window === "undefined" || !analyticsEnabled) return;
  if (readConsent() !== "granted") return;
  const clean = Object.fromEntries(Object.entries(props).filter(([, v]) => v !== undefined)) as EventProps;
  window.gtag?.("event", event, clean);
  window.plausible?.(event, { props: clean });
  if (process.env.NODE_ENV !== "production") console.debug("[analytics]", event, clean);
}
