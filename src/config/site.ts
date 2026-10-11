/**
 * Runtime / deployment settings derived from environment variables.
 * See `.env.example` for every supported variable.
 */

function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

export const siteConfig = {
  /** Public origin used for canonical URLs, sitemap and Open Graph. */
  url: normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  defaultLocale: "fr" as const,
  /**
   * Demonstration content (example routes, agencies, programmes) is shown in
   * development only. A staging preview can opt in with
   * NEXT_PUBLIC_SHOW_DEMO_CONTENT=true — pages are then marked `noindex`.
   */
  showPreviewContent:
    process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_SHOW_DEMO_CONTENT === "true",
  /**
   * Block indexing entirely (staging deployments). Production must set
   * NEXT_PUBLIC_ALLOW_INDEXING=true once the domain and content are final.
   */
  allowIndexing:
    process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true" &&
    process.env.NEXT_PUBLIC_SHOW_DEMO_CONTENT !== "true",
  /** "local" = FAQ assistant in the browser, "remote" = /api/chat (optional AI). */
  chatMode: (process.env.NEXT_PUBLIC_CHAT_MODE === "remote" ? "remote" : "local") as
    | "local"
    | "remote",
};

export function absoluteUrl(path = "/"): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
