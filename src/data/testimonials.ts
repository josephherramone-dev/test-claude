import type { Testimonial } from "@/types/content";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  TESTIMONIALS
 * ─────────────────────────────────────────────────────────────────────────────
 *  Only authentic reviews supplied by the company or copied from a verifiable
 *  public source (with the author's public display name as published there).
 *  Always set `source`, and `sourceUrl` whenever possible.
 *
 *  While this list is empty the testimonials section is hidden in production
 *  and replaced by a "reviews needed" prompt in development.
 */
export const testimonials: Testimonial[] = [];
