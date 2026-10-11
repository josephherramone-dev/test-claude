import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { company } from "@/config/company";
import { verifiedRoutes } from "@/data/routes";
import { routeSlug } from "@/lib/content";

/** Only real, indexable pages: verified routes only, legal pages once completed. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/reservation", priority: 0.9, changeFrequency: "monthly" },
    { path: "/trajets", priority: 0.9, changeFrequency: "weekly" },
    { path: "/agences", priority: 0.8, changeFrequency: "monthly" },
    { path: "/services", priority: 0.7, changeFrequency: "monthly" },
    { path: "/formation", priority: 0.7, changeFrequency: "monthly" },
    { path: "/a-propos", priority: 0.6, changeFrequency: "yearly" },
    { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
  ];
  if (company.legalName && company.legal.registeredOffice && company.legal.rc) {
    pages.push({ path: "/mentions-legales", priority: 0.2, changeFrequency: "yearly" });
  }
  if (company.legalName) pages.push({ path: "/confidentialite", priority: 0.2, changeFrequency: "yearly" });

  return [
    ...pages.map((p) => ({ url: absoluteUrl(p.path), lastModified: now, changeFrequency: p.changeFrequency, priority: p.priority })),
    ...verifiedRoutes.map((route) => ({
      url: absoluteUrl(`/trajets/${routeSlug(route)}`),
      lastModified: route.lastVerified ? new Date(route.lastVerified) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
