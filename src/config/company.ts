/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  COMPANY INFORMATION — single source of truth
 * ─────────────────────────────────────────────────────────────────────────────
 *  Replace every `null` / empty list with VERIFIED information supplied by
 *  Carla Tamassint Transport. Components hide a field (or show a contact
 *  fallback) when it is null, so nothing invented is ever displayed.
 *
 *  Do not add claims (fleet size, founding date, certifications, amenities,
 *  punctuality guarantees…) unless the company has confirmed them.
 */

export interface SocialLinks {
  facebook: string | null;
  instagram: string | null;
  tiktok: string | null;
  youtube: string | null;
  linkedin: string | null;
}

export interface CompanyInfo {
  name: string;
  /** Wordmark painted on the vehicles. */
  brandMark: string;
  /** Signature painted on the vehicles. */
  signature: string;
  legalName: string | null;
  /** Year of creation — only if verified. */
  foundingYear: number | null;
  contact: {
    /** E.164 format, e.g. "+212600000000". */
    phone: string | null;
    /** Human format, e.g. "06 00 00 00 00". */
    phoneDisplay: string | null;
    email: string | null;
    /** WhatsApp number in E.164 format. The button is hidden while null. */
    whatsapp: string | null;
    /** Head office postal address. */
    address: string | null;
    city: string | null;
    /** e.g. "Tous les jours, 08:00 – 20:00" */
    customerServiceHours: string | null;
  };
  social: SocialLinks;
  /** Public page where real customer reviews can be read (Google, Facebook…). */
  reviewSource: { label: string; url: string } | null;
  /**
   * Verified practices displayed inside the four pillars.
   * Example (only if TRUE): "Contrôle technique des véhicules à jour".
   */
  verifiedPractices: {
    security: string[];
    time: string[];
    comfort: string[];
    training: string[];
  };
  /** Onboard amenities — only those that are actually available. */
  amenities: string[];
  /** Official legal identifiers for the legal notice page. */
  legal: {
    registeredOffice: string | null;
    rc: string | null;
    ice: string | null;
    taxId: string | null;
    publicationDirector: string | null;
    host: string | null;
  };
}

export const company: CompanyInfo = {
  name: "Carla Tamassint Transport",
  brandMark: "C.ARLA",
  signature: "Travel in style",
  legalName: null,
  foundingYear: null,
  contact: {
    phone: null,
    phoneDisplay: null,
    email: null,
    whatsapp: null,
    address: null,
    city: null,
    customerServiceHours: null,
  },
  social: {
    facebook: null,
    instagram: null,
    tiktok: null,
    youtube: null,
    linkedin: null,
  },
  reviewSource: null,
  verifiedPractices: {
    security: [],
    time: [],
    comfort: [],
    training: [],
  },
  amenities: [],
  legal: {
    registeredOffice: null,
    rc: null,
    ice: null,
    taxId: null,
    publicationDirector: null,
    host: null,
  },
};

export const hasDirectContact = Boolean(company.contact.phone || company.contact.email);

export function socialEntries(): { label: string; url: string }[] {
  const labels: Record<keyof SocialLinks, string> = {
    facebook: "Facebook",
    instagram: "Instagram",
    tiktok: "TikTok",
    youtube: "YouTube",
    linkedin: "LinkedIn",
  };
  return (Object.keys(labels) as (keyof SocialLinks)[])
    .filter((key) => company.social[key])
    .map((key) => ({ label: labels[key], url: company.social[key] as string }));
}
