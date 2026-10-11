/**
 * Content models shared by the configuration files in `src/data` and `src/config`.
 *
 * Every entry carries a `status`:
 *  - "verified": information confirmed by Carla Tamassint Transport. Published in production.
 *  - "demo":     example content used to preview layouts. Never rendered in production
 *                (unless NEXT_PUBLIC_SHOW_DEMO_CONTENT=true on a non-indexed preview), never
 *                listed in the sitemap and never emitted as structured data.
 */
export type ContentStatus = "verified" | "demo";

export interface City {
  /** URL-safe identifier, e.g. "al-hoceima". */
  slug: string;
  /** Display name, e.g. "Al Hoceima". */
  name: string;
}

export interface Departure {
  /** Local departure time "HH:MM" (24h). */
  time: string;
  /** Local arrival time "HH:MM" (24h), when confirmed. */
  arrival?: string;
  /** Days of operation in plain French, e.g. "Tous les jours", "Lun – Ven". */
  days?: string;
  /** Departure point (agency / gare routière), when confirmed. */
  from?: string;
  note?: string;
}

export interface RouteEntry {
  status: ContentStatus;
  origin: City;
  destination: City;
  /** Typical duration in minutes, only when confirmed by the company. */
  durationMinutes?: number;
  /** Intermediate stops, only when confirmed. */
  stops?: string[];
  departures?: Departure[];
  /** Short editorial description of the route (optional). */
  description?: string;
  /** Verified Markoub.ma URL for this route, if the company provides one. */
  bookingUrl?: string;
  /** ISO date of the last data check, displayed to visitors. */
  lastVerified?: string;
}

export interface OpeningHours {
  /** e.g. "Lundi – Samedi" */
  days: string;
  /** e.g. "08:00 – 20:00" */
  hours: string;
}

export interface Agency {
  status: ContentStatus;
  id: string;
  name: string;
  city: City;
  address?: string;
  phone?: string;
  hours?: OpeningHours[];
  /** How tickets can be bought at this agency (guichet, paiement accepté…). */
  ticketInfo?: string;
  coordinates?: { lat: number; lng: number };
  /** Optional explicit Google Maps link; generated from coordinates/address otherwise. */
  mapsUrl?: string;
}

export interface Testimonial {
  status: ContentStatus;
  name: string;
  quote: string;
  /** 1–5, only when the source provides a rating. */
  rating?: number;
  /** Where the review was published, e.g. "Google". */
  source: string;
  sourceUrl?: string;
  date?: string;
}

export interface FaqEntry {
  id: string;
  question: string;
  /** Paragraphs of plain text. */
  answer: string[];
  links?: { label: string; href: string }[];
  /** Extra words used by the chatbot to match visitor questions. */
  keywords: string[];
}

export interface TrainingProgram {
  status: ContentStatus;
  id: string;
  title: string;
  summary: string;
  audience?: string;
  /** Only when confirmed (no invented durations). */
  duration?: string;
  prerequisites?: string[];
  /** Only when confirmed (no invented accreditation). */
  certification?: string;
}
