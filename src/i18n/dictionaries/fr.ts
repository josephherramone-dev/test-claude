/**
 * French UI strings. Add `ar.ts` / `en.ts` with the same shape to localise
 * the interface (see src/i18n/config.ts).
 */
export const fr = {
  brand: {
    identifier: "CARLA TAMASSINT TRANSPORT",
  },
  cta: {
    book: "Réserver un billet",
    bookMine: "Réserver mon billet",
    discoverRoutes: "Découvrir nos trajets",
    contact: "Nous contacter",
    openPartner: "Continuer sur Markoub.ma",
    directions: "Itinéraire",
    call: "Appeler",
  },
  common: {
    skipToContent: "Aller au contenu principal",
    menu: "Menu",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    home: "Accueil",
    newTab: "(s'ouvre dans un nouvel onglet)",
    demoBadge: "Démonstration",
    demoNotice: "Contenu de démonstration — visible uniquement en développement. Ne pas publier.",
    toComplete: "À compléter",
    scroll: "Défiler",
  },
  trust: {
    safety: "Sécurité",
    safetyText: "La sécurité des voyageurs au cœur de nos choix",
    punctuality: "Ponctualité",
    punctualityText: "Des départs organisés et une information claire",
    comfort: "Confort",
    comfortText: "Un voyage serein, dans l'esprit « Travel in style »",
  },
  chat: {
    open: "Ouvrir Assistant Carla",
    close: "Fermer l'assistant",
    title: "Assistant Carla",
    subtitle: "Assistant virtuel",
    placeholder: "Posez votre question…",
    send: "Envoyer",
    typing: "Assistant Carla écrit…",
    disclaimer:
      "Assistant virtuel : réponses générées à partir des informations publiées sur ce site. Pour toute confirmation, contactez notre équipe.",
    aiLabel: "Réponse générée par IA",
    reset: "Nouvelle conversation",
  },
} as const;

export type Dictionary = typeof fr;
