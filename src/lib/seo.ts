import type { Metadata } from "next";
import { company, socialEntries } from "@/config/company";
import { images } from "@/config/images";
import { absoluteUrl, siteConfig } from "@/config/site";
import type { Agency, FaqEntry } from "@/types/content";

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  /** Force noindex (placeholder pages, demo content…). */
  noindex?: boolean;
  image?: { src: string; alt: string; width: number; height: number };
}

/** Builds unique title/description, canonical URL, Open Graph and Twitter tags. */
export function pageMetadata({ title, description, path, noindex, image }: PageMetaInput): Metadata {
  const og = image ?? images.hero;
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noindex || !siteConfig.allowIndexing ? { index: false, follow: !noindex } : undefined,
    openGraph: {
      type: "website",
      locale: "fr_MA",
      url,
      siteName: company.name,
      title,
      description,
      images: [{ url: absoluteUrl(og.src), width: og.width, height: og.height, alt: og.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(og.src)],
    },
  };
}

type JsonLd = Record<string, unknown>;

/** Organization — only verified fields are emitted. */
export function organizationJsonLd(): JsonLd {
  const sameAs = socialEntries().map((s) => s.url);
  const data: JsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: company.name,
    url: absoluteUrl("/"),
    image: absoluteUrl(images.hero.src),
  };
  if (company.legalName) data.legalName = company.legalName;
  if (company.foundingYear) data.foundingDate = String(company.foundingYear);
  if (sameAs.length) data.sameAs = sameAs;
  if (company.contact.phone || company.contact.email) {
    data.contactPoint = {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["French", "Arabic"],
      ...(company.contact.phone ? { telephone: company.contact.phone } : {}),
      ...(company.contact.email ? { email: company.contact.email } : {}),
    };
  }
  if (company.contact.address) {
    data.address = {
      "@type": "PostalAddress",
      streetAddress: company.contact.address,
      ...(company.contact.city ? { addressLocality: company.contact.city } : {}),
      addressCountry: "MA",
    };
  }
  return data;
}

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: company.name,
    url: absoluteUrl("/"),
    inLanguage: "fr-MA",
    publisher: { "@id": absoluteUrl("/#organization") },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqPageJsonLd(entries: FaqEntry[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer.join(" ") },
    })),
  };
}

/** LocalBusiness for VERIFIED agencies that have a real address. */
export function agencyJsonLd(agency: Agency): JsonLd | null {
  if (agency.status !== "verified" || !agency.address) return null;
  const data: JsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": absoluteUrl(`/agences#${agency.id}`),
    name: agency.name,
    parentOrganization: { "@id": absoluteUrl("/#organization") },
    address: {
      "@type": "PostalAddress",
      streetAddress: agency.address,
      addressLocality: agency.city.name,
      addressCountry: "MA",
    },
    url: absoluteUrl(`/agences#${agency.id}`),
  };
  if (agency.phone) data.telephone = agency.phone;
  if (agency.coordinates) {
    data.geo = { "@type": "GeoCoordinates", latitude: agency.coordinates.lat, longitude: agency.coordinates.lng };
  }
  return data;
}
