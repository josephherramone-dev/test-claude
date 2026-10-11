import type { ImageKey } from "@/config/images";
import type { CompanyInfo } from "@/config/company";

export type PillarId = "securite" | "temps" | "confort" | "formation";

export interface Pillar {
  id: PillarId;
  /** Key into company.verifiedPractices */
  practicesKey: keyof CompanyInfo["verifiedPractices"];
  number: string;
  eyebrow: string;
  englishLabel: string;
  title: string;
  headline: string;
  lead: string;
  /** Value statements — what the company stands for, not factual claims. */
  values: { title: string; text: string }[];
  image: ImageKey;
  cta: { label: string; href: string };
}

/**
 * The four pillars. Copy is written as commitments and values. Concrete
 * practices (maintenance schedule, equipment, certifications…) are listed only
 * through `company.verifiedPractices` once the company confirms them.
 */
export const pillars: Pillar[] = [
  {
    id: "securite",
    practicesKey: "security",
    number: "01",
    eyebrow: "La sécurité avant tout",
    englishLabel: "Security",
    title: "Sécurité",
    headline: "Voyager sereinement commence par la confiance.",
    lead:
      "Confier son trajet à un transporteur, c'est lui confier ce qui compte le plus. Chez Carla Tamassint Transport, la sécurité des voyageurs guide nos choix : sur la route, à bord et avant chaque départ.",
    values: [
      {
        title: "Une conduite responsable",
        text: "Une conduite attentive et mesurée, respectueuse des voyageurs et des autres usagers de la route.",
      },
      {
        title: "Des véhicules suivis",
        text: "L'état des autocars est une responsabilité que nous prenons au sérieux, trajet après trajet.",
      },
      {
        title: "Des équipes impliquées",
        text: "Conducteurs et agents partagent la même exigence : que chaque passager arrive à bon port.",
      },
    ],
    image: "security",
    cta: { label: "Nous contacter", href: "/contact" },
  },
  {
    id: "temps",
    practicesKey: "time",
    number: "02",
    eyebrow: "Le temps de nos voyageurs compte",
    englishLabel: "Time",
    title: "Temps",
    headline: "Votre temps compte. Chaque trajet aussi.",
    lead:
      "Un voyage réussi se prépare : départs organisés, informations claires et équipes joignables. Nous mettons l'accent sur l'organisation pour que vous puissiez planifier votre trajet l'esprit tranquille.",
    values: [
      {
        title: "Des départs organisés",
        text: "Une préparation soignée de chaque départ pour un embarquement fluide.",
      },
      {
        title: "Une information claire",
        text: "Trajets, points de départ et horaires confirmés publiés ici, à consulter avant de partir.",
      },
      {
        title: "Une équipe à l'écoute",
        text: "Un service client à contacter pour toute question avant ou pendant votre voyage.",
      },
    ],
    image: "time",
    cta: { label: "Découvrir nos trajets", href: "/trajets" },
  },
  {
    id: "confort",
    practicesKey: "comfort",
    number: "03",
    eyebrow: "Le confort du voyage",
    englishLabel: "Well-driven",
    title: "Confort",
    headline: "Prenez la route. Profitez du voyage.",
    lead:
      "« Travel in style » n'est pas qu'une signature peinte sur nos autocars. C'est une façon de concevoir le voyage : un accueil soigné, un trajet serein et des paysages marocains à contempler par la fenêtre.",
    values: [
      {
        title: "Un accueil soigné",
        text: "Courtoisie et disponibilité, de l'agence jusqu'à la descente du car.",
      },
      {
        title: "Une conduite souple",
        text: "Une conduite professionnelle, pensée pour le confort de chacun à bord.",
      },
      {
        title: "Le plaisir de la route",
        text: "Le voyage en autocar, c'est aussi le temps de lire, de se reposer et de regarder le Maroc défiler.",
      },
    ],
    image: "comfort",
    cta: { label: "Réserver un billet", href: "/reservation" },
  },
  {
    id: "formation",
    practicesKey: "training",
    number: "04",
    eyebrow: "Former les conducteurs de demain",
    englishLabel: "Formation",
    title: "Formation",
    headline: "Former aujourd'hui les professionnels de la route de demain.",
    lead:
      "La qualité d'un voyage repose d'abord sur celles et ceux qui conduisent. Nous accordons une place centrale à la transmission du savoir-faire et au développement professionnel des conducteurs.",
    values: [
      {
        title: "Transmettre l'exigence",
        text: "Partager les bonnes pratiques de conduite et de service aux voyageurs.",
      },
      {
        title: "Accompagner les parcours",
        text: "Informer les futurs professionnels de la route sur les métiers du transport de voyageurs.",
      },
      {
        title: "Progresser ensemble",
        text: "Faire de la formation un engagement continu, au service de la sécurité de tous.",
      },
    ],
    image: "training",
    cta: { label: "Découvrir la formation", href: "/formation" },
  },
];
