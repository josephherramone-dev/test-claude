import { siteConfig } from "@/config/site";
import { demoAgencies, verifiedAgencies } from "@/data/agencies";
import { demoRoutes, verifiedRoutes } from "@/data/routes";
import { testimonials } from "@/data/testimonials";
import { demoPrograms, trainingContent } from "@/data/training";
import type { Agency, City, RouteEntry, Testimonial, TrainingProgram } from "@/types/content";

/**
 * Content selectors. Demo entries are only returned when preview content is
 * enabled (development, or an explicit non-indexed staging preview).
 */
const withPreview = <T>(verified: T[], demo: T[]): T[] =>
  siteConfig.showPreviewContent ? [...verified, ...demo] : verified;

export function routeSlug(route: Pick<RouteEntry, "origin" | "destination">): string {
  return `${route.origin.slug}-${route.destination.slug}`;
}

export function getRoutes(): RouteEntry[] {
  return withPreview(verifiedRoutes, demoRoutes);
}

export function getRouteBySlug(slug: string): RouteEntry | undefined {
  return getRoutes().find((route) => routeSlug(route) === slug);
}

export function getRouteCities(): { origins: City[]; destinations: City[] } {
  const unique = (cities: City[]) =>
    [...new Map(cities.map((c) => [c.slug, c])).values()].sort((a, b) => a.name.localeCompare(b.name, "fr"));
  const routes = getRoutes();
  return {
    origins: unique(routes.map((r) => r.origin)),
    destinations: unique(routes.map((r) => r.destination)),
  };
}

/** Other routes sharing a city with the given route (internal linking). */
export function getRelatedRoutes(route: RouteEntry, limit = 3): RouteEntry[] {
  const cities = new Set([route.origin.slug, route.destination.slug]);
  return getRoutes()
    .filter((r) => routeSlug(r) !== routeSlug(route))
    .filter((r) => cities.has(r.origin.slug) || cities.has(r.destination.slug))
    .slice(0, limit);
}

export function getAgencies(): Agency[] {
  return withPreview(verifiedAgencies, demoAgencies);
}

export function getAgenciesInCities(slugs: string[]): Agency[] {
  return getAgencies().filter((a) => slugs.includes(a.city.slug));
}

export function getTestimonials(): Testimonial[] {
  // Only verified testimonials exist in the data model: nothing to preview.
  return testimonials.filter((t) => t.status === "verified");
}

export function getTrainingPrograms(): TrainingProgram[] {
  return withPreview(trainingContent.verifiedPrograms, demoPrograms);
}

export function agencyMapsUrl(agency: Agency): string | null {
  if (agency.mapsUrl) return agency.mapsUrl;
  if (agency.coordinates) {
    const { lat, lng } = agency.coordinates;
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }
  if (agency.address && agency.status === "verified") {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      `${agency.address}, ${agency.city.name}, Maroc`,
    )}`;
  }
  return null;
}
