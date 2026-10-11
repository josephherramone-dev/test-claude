import type { FaqEntry } from "@/types/content";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  FAQ — also the knowledge base of « Assistant Carla »
 * ─────────────────────────────────────────────────────────────────────────────
 *  Answers deliberately avoid stating policies (refunds, baggage, changes) that
 *  the company has not confirmed. When a policy is confirmed, update the answer
 *  here: the FAQ page, the home FAQ, the JSON-LD and the chatbot all follow.
 */
export const faqEntries: FaqEntry[] = [
  {
    id: "reserver",
    question: "Comment réserver un billet ?",
    answer: [
      "La réservation en ligne s'effectue sur notre plateforme partenaire Markoub.ma : choisissez votre ville de départ, votre ville d'arrivée et la date du voyage, puis suivez les étapes de réservation et de paiement directement sur Markoub.ma.",
      "Ce site ne vend pas de billets et ne collecte aucune donnée de paiement.",
    ],
    links: [
      { label: "Réserver sur Markoub.ma", href: "/reservation" },
      { label: "Voir les trajets", href: "/trajets" },
    ],
    keywords: ["reserver", "reservation", "billet", "acheter en ligne", "markoub", "payer", "paiement", "ticket", "book"],
  },
  {
    id: "acheter",
    question: "Où acheter un billet ?",
    answer: [
      "Vous pouvez acheter votre billet en ligne via Markoub.ma. Les agences et points de vente Carla Tamassint Transport sont répertoriés sur la page « Agences & billets » au fur et à mesure de leur publication.",
      "En cas de doute, contactez notre service client avant de vous déplacer.",
    ],
    links: [
      { label: "Nos agences", href: "/agences" },
      { label: "Nous contacter", href: "/contact" },
    ],
    keywords: ["acheter", "guichet", "point de vente", "ou acheter", "vente", "agence billet"],
  },
  {
    id: "horaires",
    question: "Comment connaître les horaires de départ ?",
    answer: [
      "Les horaires confirmés sont indiqués sur la page de chaque trajet. Les disponibilités à une date précise s'affichent au moment de la recherche sur Markoub.ma.",
      "Les horaires pouvant évoluer, nous vous recommandons de confirmer votre départ auprès de l'agence ou du service client avant de voyager.",
    ],
    links: [{ label: "Consulter les trajets", href: "/trajets" }],
    keywords: ["horaire", "horaires", "heure", "depart", "départ", "arrivee", "quand", "planning", "programme"],
  },
  {
    id: "agence",
    question: "Comment trouver une agence ?",
    answer: [
      "La page « Agences & billets » regroupe nos agences et points de vente avec, lorsqu'ils sont confirmés, l'adresse, le téléphone, les horaires d'ouverture et un lien d'itinéraire.",
    ],
    links: [{ label: "Trouver une agence", href: "/agences" }],
    keywords: ["agence", "agences", "adresse", "trouver", "localisation", "ou se trouve", "bureau", "gare"],
  },
  {
    id: "retard",
    question: "Que faire en cas de retard ?",
    answer: [
      "Si vous êtes en retard ou si votre départ est retardé, contactez au plus vite notre service client ou l'agence de départ, munis de votre référence de réservation.",
      "Les conditions applicables dépendent des conditions de vente du billet (Markoub.ma pour un achat en ligne, agence pour un achat au guichet) : notre équipe vous indiquera les options possibles.",
    ],
    links: [{ label: "Contacter le service client", href: "/contact" }],
    keywords: ["retard", "en retard", "rater", "rate", "manque", "attente", "annule", "decale"],
  },
  {
    id: "contact",
    question: "Comment contacter le service client ?",
    answer: [
      "Utilisez le formulaire de la page Contact en précisant l'objet de votre demande. Les coordonnées directes du service client (téléphone, e-mail) y figurent dès qu'elles sont publiées.",
    ],
    links: [{ label: "Page contact", href: "/contact" }],
    keywords: ["contact", "contacter", "service client", "telephone", "téléphone", "appeler", "email", "mail", "joindre", "whatsapp"],
  },
  {
    id: "bagages",
    question: "Quelles sont les règles relatives aux bagages ?",
    answer: [
      "Les règles relatives aux bagages (nombre, dimensions, objets acceptés) n'ont pas encore été publiées sur ce site.",
      "Avant votre voyage, renseignez-vous auprès de notre service client ou consultez les conditions indiquées lors de votre réservation sur Markoub.ma.",
    ],
    links: [{ label: "Poser la question", href: "/contact?sujet=billets" }],
    keywords: ["bagage", "bagages", "valise", "sac", "poids", "soute", "kg", "colis"],
  },
  {
    id: "modifier",
    question: "Peut-on modifier ou annuler une réservation ?",
    answer: [
      "Les possibilités de modification et d'annulation dépendent des conditions de vente du billet. Pour un achat en ligne, reportez-vous aux conditions de Markoub.ma ou à son service client ; pour un achat en agence, adressez-vous à l'agence concernée.",
      "Notre équipe peut vous orienter : contactez-nous avec votre référence de réservation.",
    ],
    links: [
      { label: "Ouvrir Markoub.ma", href: "https://markoub.ma/" },
      { label: "Nous contacter", href: "/contact?sujet=billets" },
    ],
    keywords: [
      "modifier",
      "modification",
      "annuler",
      "annulation",
      "rembourser",
      "remboursement",
      "changer",
      "report",
      "annuler ma reservation",
      "annuler mon billet",
      "modifier ma reservation",
      "modifier mon billet",
      "changer la date",
    ],
  },
  {
    id: "formation",
    question: "Quelles formations sont proposées aux conducteurs ?",
    answer: [
      "La page Formation présente notre démarche et les programmes destinés aux conducteurs et professionnels de la route, au fur et à mesure de leur publication.",
      "Pour connaître les prochaines sessions, les conditions d'accès et les modalités d'inscription, envoyez une demande d'information depuis cette page.",
    ],
    links: [{ label: "Découvrir la formation", href: "/formation" }],
    keywords: ["formation", "former", "conducteur", "chauffeur", "permis", "stage", "apprendre", "inscription", "cours", "emploi"],
  },
];
