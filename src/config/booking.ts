/**
 * Markoub.ma booking integration.
 *
 * Booking and payment happen exclusively on Markoub.ma — this website never
 * collects payment details.
 *
 * EMBEDDING: an <iframe> is only rendered when NEXT_PUBLIC_MARKOUB_EMBED_URL is
 * set. Before setting it, confirm that the page:
 *   1. is a functional search/booking page (not just the homepage), and
 *   2. allows framing — no `X-Frame-Options: DENY|SAMEORIGIN` header and a
 *      `Content-Security-Policy: frame-ancestors` that includes this domain.
 *      Check with: curl -sI "<url>" | grep -iE "x-frame-options|content-security-policy"
 * Ideally obtain written confirmation / a partner widget URL from Markoub.
 * Otherwise the elegant fallback panel with an external link is used.
 */
export const bookingConfig = {
  partnerName: "Markoub.ma",
  /** Official homepage, opened in a new tab. */
  partnerUrl: "https://markoub.ma/",
  /** Verified, embeddable booking URL. `null` = no iframe, fallback panel only. */
  embedUrl: process.env.NEXT_PUBLIC_MARKOUB_EMBED_URL || null,
  /**
   * Optional deep-link template to a route search on Markoub.ma, once its format
   * is verified. Placeholders: {from} {to} {date} (city slugs / YYYY-MM-DD).
   * Example (NOT verified): "https://markoub.ma/…?from={from}&to={to}&date={date}"
   */
  searchUrlTemplate: process.env.NEXT_PUBLIC_MARKOUB_SEARCH_URL_TEMPLATE || null,
  /** Show the fallback if the iframe has not loaded within this delay. */
  embedTimeoutMs: 10000,
} as const;

export function buildPartnerSearchUrl(params: {
  from?: string;
  to?: string;
  date?: string;
}): string | null {
  const template = bookingConfig.searchUrlTemplate;
  if (!template) return null;
  return template
    .replace("{from}", encodeURIComponent(params.from ?? ""))
    .replace("{to}", encodeURIComponent(params.to ?? ""))
    .replace("{date}", encodeURIComponent(params.date ?? ""));
}
