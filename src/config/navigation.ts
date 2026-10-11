export interface NavItem {
  label: string;
  href: string;
}

export const mainNav: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Nos services", href: "/services" },
  { label: "Trajets", href: "/trajets" },
  { label: "Agences & billets", href: "/agences" },
  { label: "Formation", href: "/formation" },
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Voyager",
    items: [
      { label: "Réserver un billet", href: "/reservation" },
      { label: "Trajets", href: "/trajets" },
      { label: "Agences & points de vente", href: "/agences" },
      { label: "Questions fréquentes", href: "/faq" },
    ],
  },
  {
    title: "L'entreprise",
    items: [
      { label: "Nos services", href: "/services" },
      { label: "Formation des conducteurs", href: "/formation" },
      { label: "À propos", href: "/a-propos" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Informations",
    items: [
      { label: "Mentions légales", href: "/mentions-legales" },
      { label: "Confidentialité", href: "/confidentialite" },
    ],
  },
];
