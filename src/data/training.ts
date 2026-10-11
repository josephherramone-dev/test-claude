import type { TrainingProgram } from "@/types/content";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  DRIVER TRAINING (FORMATION)
 * ─────────────────────────────────────────────────────────────────────────────
 *  Fill in with information confirmed by the company. Never invent
 *  accreditation, diplomas, prices, durations or prerequisites.
 */
export const trainingContent = {
  /** Intended participants, e.g. "Titulaires du permis D souhaitant…". */
  audiences: [] as string[],
  /** Eligibility requirements, e.g. "Permis de catégorie D en cours de validité". */
  eligibility: [] as string[],
  /** Documents to provide at registration. */
  documents: [] as string[],
  verifiedPrograms: [] as TrainingProgram[],
};

/** DEMONSTRATION DATA — development / staging preview only. */
export const demoPrograms: TrainingProgram[] = [
  {
    status: "demo",
    id: "demo-programme-1",
    title: "Programme exemple — intitulé à confirmer",
    summary:
      "Emplacement réservé à la description d'un programme réel : objectifs, contenu, encadrement.",
    audience: "Public à confirmer",
    duration: "Durée à confirmer",
    prerequisites: ["Prérequis à confirmer"],
  },
  {
    status: "demo",
    id: "demo-programme-2",
    title: "Second programme exemple",
    summary: "Exemple de carte programme sans durée ni certification renseignées.",
  },
];
