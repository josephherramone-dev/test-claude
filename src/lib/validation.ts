/**
 * Inquiry (contact / training) validation shared by the browser and the API.
 * Plain TypeScript — no schema library in the client bundle.
 */
export const inquiryTypes = [
  { value: "billets", label: "Billets & réservation" },
  { value: "trajets", label: "Trajets & horaires" },
  { value: "agences", label: "Agences" },
  { value: "formation", label: "Formation des conducteurs" },
  { value: "partenariat", label: "Partenariat professionnel" },
  { value: "autre", label: "Autre demande" },
] as const;

export type InquiryType = (typeof inquiryTypes)[number]["value"];

export function isInquiryType(value: unknown): value is InquiryType {
  return typeof value === "string" && inquiryTypes.some((t) => t.value === value);
}

export interface InquiryInput {
  fullName: string;
  email: string;
  phone: string;
  type: InquiryType;
  /** Free text, e.g. desired training programme or company name. */
  detail: string;
  message: string;
  consent: true;
  /** Honeypot — must stay empty. */
  website: string;
  /** Timestamp (ms) when the form was rendered — anti-bot timing check. */
  startedAt: number;
}

export type InquiryField = "fullName" | "email" | "phone" | "type" | "detail" | "message" | "consent" | "website" | "startedAt";
export type InquiryErrors = Partial<Record<InquiryField, string>>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Moroccan or international numbers: digits, spaces, dots, dashes, optional leading +. */
const phoneRegex = /^\+?[0-9][0-9\s.-]{7,18}$/;

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export function validateInquiry(raw: unknown): { ok: true; data: InquiryInput } | { ok: false; errors: InquiryErrors } {
  const input = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const errors: InquiryErrors = {};

  const fullName = str(input.fullName);
  const email = str(input.email);
  const phone = str(input.phone);
  const detail = str(input.detail);
  const message = str(input.message);
  const website = str(input.website);
  const startedAt = typeof input.startedAt === "number" && Number.isFinite(input.startedAt) ? input.startedAt : 0;

  if (fullName.length < 2) errors.fullName = "Indiquez votre nom complet.";
  else if (fullName.length > 120) errors.fullName = "Le nom est trop long.";
  if (!emailRegex.test(email) || email.length > 160) errors.email = "Adresse e-mail invalide.";
  if (phone && (phone.length > 24 || !phoneRegex.test(phone))) errors.phone = "Numéro de téléphone invalide.";
  if (!isInquiryType(input.type)) errors.type = "Choisissez l'objet de votre demande.";
  if (detail.length > 160) errors.detail = "Ce champ est trop long (160 caractères maximum).";
  if (message.length < 10) errors.message = "Votre message doit contenir au moins 10 caractères.";
  else if (message.length > 3000) errors.message = "Votre message est trop long (3000 caractères maximum).";
  if (input.consent !== true) errors.consent = "Votre accord est nécessaire pour traiter la demande.";
  if (website) errors.website = "Requête refusée.";
  if (startedAt <= 0) errors.startedAt = "Requête invalide.";

  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    data: { fullName, email, phone, type: input.type as InquiryType, detail, message, consent: true, website: "", startedAt },
  };
}
