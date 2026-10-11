import { PageHero } from "@/components/layout/PageHero";
import { PillarSection } from "@/components/pillars/PillarSection";
import { RouteInfoBlock } from "@/components/routes/RouteInfoBlock";
import { ContactCta } from "@/components/sections/ContactCta";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { pillars } from "@/data/pillars";
import { pageMetadata } from "@/lib/seo";
import { t } from "@/i18n";

export const metadata = pageMetadata({
  title: "Nos services — Sécurité, temps, confort et formation",
  description:
    "Les quatre engagements de Carla Tamassint Transport : la sécurité des voyageurs, le respect de votre temps, le confort du voyage en autocar et la formation des conducteurs.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Nos services"
        title="Quatre engagements pour chaque voyage."
        lead="Sécurité, temps, confort et formation : ce sont les piliers sur lesquels repose chaque trajet Carla Tamassint Transport."
        breadcrumbs={[{ name: "Nos services", path: "/services" }]}
        image="comfort"
      >
        <nav aria-label="Aller à un engagement">
          <ul className="flex flex-wrap gap-2">
            {pillars.map((p) => (
              <li key={p.id}>
                <a
                  href={`#${p.id}`}
                  className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm text-white ring-1 ring-white/25 transition-colors hover:bg-white/10"
                >
                  <span className="text-carla-300">{p.number}</span> {p.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      {pillars.map((pillar, index) => (
        <PillarSection key={pillar.id} pillar={pillar} tone={index % 2 === 0 ? "light" : "dark"} reverse={index % 2 === 1}>
          {pillar.id === "temps" ? <RouteInfoBlock /> : null}
        </PillarSection>
      ))}

      <section className="bg-paper py-20">
        <div className="container-page flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <p className="display-md max-w-xl">Prêt à prendre la route ?</p>
          <ButtonLink href="/reservation" size="lg" event="booking_cta_click" eventProps={{ location: "services" }}>
            {t.cta.book}
          </ButtonLink>
        </div>
      </section>
      <ContactCta />
    </>
  );
}
