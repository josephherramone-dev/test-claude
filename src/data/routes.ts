import type { RouteEntry } from "@/types/content";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  ROUTES (TRAJETS)
 * ─────────────────────────────────────────────────────────────────────────────
 *  Add each route actually operated by Carla Tamassint Transport to
 *  `verifiedRoutes`, with status "verified". Every verified route gets its own
 *  indexable page at /trajets/<origine>-<destination> and appears in the sitemap.
 *
 *  Only fill `durationMinutes`, `departures`, `stops` when confirmed by the
 *  company. Prices are intentionally not part of the model: fares are shown by
 *  the booking platform at the time of purchase.
 *
 *  Example:
 *  {
 *    status: "verified",
 *    origin: { slug: "al-hoceima", name: "Al Hoceima" },
 *    destination: { slug: "tanger", name: "Tanger" },
 *    durationMinutes: 300,
 *    departures: [{ time: "07:30", arrival: "12:30", days: "Tous les jours" }],
 *    lastVerified: "2026-10-01",
 *  },
 */
export const verifiedRoutes: RouteEntry[] = [];

/**
 * DEMONSTRATION DATA — development / staging preview only.
 * These entries are NOT company information. They only exist so the route
 * system can be reviewed visually before real data is supplied. They are never
 * rendered in production, never indexed and never emitted as structured data.
 */
export const demoRoutes: RouteEntry[] = [
  {
    status: "demo",
    origin: { slug: "ville-a", name: "Ville A" },
    destination: { slug: "ville-b", name: "Ville B" },
    durationMinutes: 270,
    stops: ["Arrêt exemple 1", "Arrêt exemple 2"],
    departures: [
      { time: "07:00", arrival: "11:30", days: "Exemple — jours à confirmer" },
      { time: "15:00", arrival: "19:30", days: "Exemple — jours à confirmer" },
    ],
    description:
      "Exemple de fiche trajet. Les horaires, arrêts et durées affichés ici sont fictifs et servent uniquement à prévisualiser la mise en page.",
  },
  {
    status: "demo",
    origin: { slug: "ville-a", name: "Ville A" },
    destination: { slug: "ville-c", name: "Ville C" },
    description: "Exemple de trajet sans horaires confirmés : la page invite à vérifier sur la plateforme de réservation.",
  },
  {
    status: "demo",
    origin: { slug: "ville-b", name: "Ville B" },
    destination: { slug: "ville-c", name: "Ville C" },
    durationMinutes: 180,
  },
];
