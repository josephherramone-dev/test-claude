import Link from "next/link";
import { Building2, CalendarCheck, Headphones, Ticket } from "lucide-react";
import { AgencyDirectory } from "@/components/agencies/AgencyDirectory";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { ContactCta } from "@/components/sections/ContactCta";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { PreviewNotice } from "@/components/ui/PreviewNotice";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { bookingConfig } from "@/config/booking";
import { agencyMapsUrl, getAgencies } from "@/lib/content";
import { agencyJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Nos agences et points de vente",
  description:
    "Agences et points de vente Carla Tamassint Transport : adresses, horaires d'ouverture, itinéraires et informations pour acheter votre billet d'autocar.",
  path: "/agences",
});

const ticketSteps = [
  {
    icon: Ticket,
    title: "En ligne",
    text: `Réservez et payez votre billet sur ${bookingConfig.partnerName}, notre plateforme partenaire.`,
    href: "/reservation",
    cta: "Réserver en ligne",
  },
  {
    icon: Building2,
    title: "En agence",
    text: "Rendez-vous dans l'un de nos points de vente pour acheter votre billet ou vous renseigner au guichet.",
    href: "#annuaire",
    cta: "Voir l'annuaire",
  },
  {
    icon: CalendarCheck,
    title: "Confirmer un départ",
    text: "Avant de voyager, confirmez l'horaire et le lieu de départ auprès de l'agence ou du service client.",
    href: "/trajets",
    cta: "Consulter les trajets",
  },
  {
    icon: Headphones,
    title: "Nous contacter",
    text: "Une question sur un billet, un trajet ou une agence ? Notre équipe vous oriente.",
    href: "/contact?sujet=agences",
    cta: "Contacter l'équipe",
  },
];

export default function AgenciesPage() {
  const agencies = getAgencies().map((agency) => ({ ...agency, directionsUrl: agencyMapsUrl(agency) }));
  const structured = agencies.map(agencyJsonLd).filter((d): d is Record<string, unknown> => d !== null);

  return (
    <>
      <PageHero
        eyebrow="Agences & billets"
        title="Nos agences et points de vente"
        lead="Retrouvez nos agences, leurs horaires d'ouverture et toutes les façons d'obtenir votre billet."
        breadcrumbs={[{ name: "Agences & billets", path: "/agences" }]}
        image="security"
      />

      <section aria-labelledby="tickets-title" className="bg-paper py-20 sm:py-28">
        <div className="container-page">
          <Reveal>
            <SectionHeading id="tickets-title" eyebrow="Billetterie" title="Obtenir votre billet" />
          </Reveal>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ticketSteps.map(({ icon: Icon, title, text, href, cta }, index) => (
              <Reveal as="li" key={title} delay={0.06 * index} className="flex flex-col rounded-[1.5rem] bg-white p-7 ring-1 ring-line">
                <Icon aria-hidden className="size-7 text-carla-600" />
                <h3 className="mt-6 font-[family-name:var(--font-display)] text-xl">{title}</h3>
                <p className="mt-2 flex-1 text-muted">{text}</p>
                <Link href={href} className="mt-6 text-sm font-medium text-carla-700 underline underline-offset-4">
                  {cta}
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section id="annuaire" aria-labelledby="directory-title" className="scroll-mt-24 bg-paper-2 py-20 sm:py-28">
        <div className="container-page">
          <Reveal>
            <SectionHeading id="directory-title" eyebrow="Annuaire" title="Trouver une agence" />
          </Reveal>
          <PreviewNotice className="mt-8">
            Les agences marquées « Démonstration » sont fictives. Ajoutez les agences réelles (adresse, téléphone, horaires,
            coordonnées GPS) dans <code>src/data/agencies.ts</code>.
          </PreviewNotice>
          <div className="mt-10">
            {agencies.length > 0 ? (
              <AgencyDirectory agencies={agencies} />
            ) : (
              <div className="rounded-[2rem] bg-white p-10 ring-1 ring-line">
                <Building2 aria-hidden className="size-8 text-carla-600" />
                <p className="mt-5 font-[family-name:var(--font-display)] text-2xl font-light">
                  La liste de nos agences sera publiée très prochainement.
                </p>
                <p className="mt-3 max-w-xl text-muted">
                  Pour connaître l&apos;agence la plus proche, ses horaires ou les modalités d&apos;achat au guichet, contactez notre
                  équipe. Vous pouvez aussi réserver dès maintenant en ligne.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ButtonLink href="/contact?sujet=agences">Contacter l&apos;équipe</ButtonLink>
                  <ButtonLink href="/reservation" variant="outline-dark">
                    Réserver en ligne
                  </ButtonLink>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <ContactCta />
      {structured.length > 0 && <JsonLd data={structured} />}
    </>
  );
}
