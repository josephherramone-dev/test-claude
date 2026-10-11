import type { Agency } from "@/types/content";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  AGENCIES & POINTS OF SALE
 * ─────────────────────────────────────────────────────────────────────────────
 *  Add each real agency with status "verified". Never invent addresses, phone
 *  numbers, opening hours or coordinates — leave optional fields out instead.
 *
 *  Example:
 *  {
 *    status: "verified",
 *    id: "al-hoceima-centre",
 *    name: "Agence Al Hoceima — Gare routière",
 *    city: { slug: "al-hoceima", name: "Al Hoceima" },
 *    address: "…",
 *    phone: "+2125…",
 *    hours: [{ days: "Tous les jours", hours: "07:00 – 21:00" }],
 *    ticketInfo: "Vente de billets au guichet, paiement en espèces.",
 *    coordinates: { lat: 35.24, lng: -3.93 },
 *  },
 */
export const verifiedAgencies: Agency[] = [];

/** DEMONSTRATION DATA — development / staging preview only. */
export const demoAgencies: Agency[] = [
  {
    status: "demo",
    id: "demo-agence-1",
    name: "Agence exemple — Ville A",
    city: { slug: "ville-a", name: "Ville A" },
    address: "Adresse à fournir par l'entreprise",
    hours: [{ days: "Jours à confirmer", hours: "Horaires à confirmer" }],
    ticketInfo: "Modalités de vente au guichet à confirmer.",
  },
  {
    status: "demo",
    id: "demo-agence-2",
    name: "Point de vente exemple — Ville B",
    city: { slug: "ville-b", name: "Ville B" },
  },
];
