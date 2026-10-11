import { bookingConfig } from "@/config/booking";
import { company } from "@/config/company";
import { faqEntries } from "@/data/faq";
import type { ChatLink } from "./types";

/**
 * Knowledge base of « Assistant Carla ». Built from the FAQ (src/data/faq.ts)
 * plus a few conversational intents. Answers never state schedules, prices,
 * booking status or policies that are not in the verified data.
 */
export interface KnowledgeEntry {
  id: string;
  keywords: string[];
  answer: string;
  links: ChatLink[];
}

const contactLinks: ChatLink[] = [
  ...(company.contact.phone && company.contact.phoneDisplay
    ? [{ label: `Appeler le ${company.contact.phoneDisplay}`, href: `tel:${company.contact.phone}` }]
    : []),
  { label: "Formulaire de contact", href: "/contact" },
];

const intents: KnowledgeEntry[] = [
  {
    id: "salutation",
    keywords: ["bonjour", "salut", "bonsoir", "salam", "hello", "coucou", "slt"],
    answer:
      "Bonjour et bienvenue ! Je suis Assistant Carla, l'assistant virtuel de Carla Tamassint Transport. Je peux vous orienter pour réserver un billet, consulter les trajets, trouver une agence, découvrir la formation ou contacter notre équipe.",
    links: [],
  },
  {
    id: "merci",
    keywords: ["merci", "parfait", "super", "top", "genial", "shukran", "choukran"],
    answer: "Avec plaisir ! Bon voyage avec Carla Tamassint Transport.",
    links: [],
  },
  {
    id: "prix",
    keywords: ["prix", "tarif", "tarifs", "combien", "cout", "coute", "dh", "dirham", "dirhams", "mad", "cher"],
    answer: `Je ne peux pas vous communiquer de tarif : les prix et disponibilités s'affichent au moment de votre recherche sur ${bookingConfig.partnerName}, notre plateforme de réservation partenaire. Notre service client peut aussi vous renseigner.`,
    links: [
      { label: `Rechercher sur ${bookingConfig.partnerName}`, href: "/reservation" },
      { label: "Contacter le service client", href: "/contact?sujet=billets" },
    ],
  },
  {
    id: "trajets",
    keywords: ["trajet", "trajets", "ligne", "lignes", "destination", "destinations", "ville", "villes", "route", "itineraire", "aller a", "desservez"],
    answer:
      "Les trajets confirmés de Carla Tamassint Transport sont présentés sur la page Trajets, avec les horaires lorsqu'ils sont publiés. Pour une date précise, vérifiez les disponibilités au moment de réserver.",
    links: [
      { label: "Voir les trajets", href: "/trajets" },
      { label: "Réserver un billet", href: "/reservation" },
    ],
  },
  {
    id: "humain",
    keywords: ["conseiller", "humain", "personne", "parler", "agent", "quelqu un", "reclamation", "plainte", "probleme"],
    answer:
      "Je vous mets en relation avec notre équipe : le plus simple est d'utiliser le formulaire de contact en précisant votre demande. Un membre de l'équipe vous répondra.",
    links: contactLinks,
  },
  {
    id: "partenariat",
    keywords: ["partenariat", "partenaire", "entreprise", "b2b", "collaboration", "location", "louer", "groupe", "excursion"],
    answer:
      "Pour une demande professionnelle ou de partenariat, envoyez-nous un message en choisissant « Partenariat professionnel » : notre équipe étudiera votre demande.",
    links: [{ label: "Demande de partenariat", href: "/contact?sujet=partenariat" }],
  },
];

export const knowledgeBase: KnowledgeEntry[] = [
  ...intents,
  ...faqEntries.map((entry) => ({
    id: entry.id,
    keywords: [...entry.keywords, entry.question],
    answer: entry.answer.join(" "),
    links: entry.links ?? [],
  })),
];

export const fallbackAnswer: { answer: string; links: ChatLink[] } = {
  answer:
    "Je préfère ne pas vous répondre au hasard : je n'ai pas d'information vérifiée sur ce point. Notre service client pourra vous renseigner de façon fiable.",
  links: [...contactLinks, { label: "Questions fréquentes", href: "/faq" }],
};

export const welcomeMessage =
  "Bonjour ! Je suis Assistant Carla, l'assistant virtuel de Carla Tamassint Transport. Comment puis-je vous aider ?";

export const quickActions: { label: string; message: string }[] = [
  { label: "Réserver un billet", message: "Comment réserver un billet ?" },
  { label: "Trajets & horaires", message: "Quels sont les horaires de départ ?" },
  { label: "Trouver une agence", message: "Comment trouver une agence ?" },
  { label: "Formation", message: "Quelles formations sont proposées aux conducteurs ?" },
  { label: "Contacter l'équipe", message: "Comment contacter le service client ?" },
];
