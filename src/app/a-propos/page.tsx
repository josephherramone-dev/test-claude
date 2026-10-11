import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { ContactCta } from "@/components/sections/ContactCta";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { PreviewNotice } from "@/components/ui/PreviewNotice";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { company } from "@/config/company";
import { images } from "@/config/images";
import { pillars } from "@/data/pillars";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "À propos de Carla Tamassint Transport",
  description:
    "Découvrez Carla Tamassint Transport, transporteur de voyageurs en autocar au Maroc : notre mission, nos engagements envers les passagers et notre exigence de service.",
  path: "/a-propos",
});

const commitments = [
  {
    title: "Envers nos voyageurs",
    text: "Vous accueillir avec courtoisie, vous informer clairement et vous conduire à destination dans de bonnes conditions.",
  },
  {
    title: "Envers nos équipes",
    text: "Donner aux conducteurs et aux agents les moyens d'exercer leur métier avec professionnalisme et fierté.",
  },
  {
    title: "Envers la route",
    text: "Adopter une conduite responsable, respectueuse des autres usagers et des régions que nous traversons.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="À propos"
        title="Une entreprise de transport, une exigence de service."
        lead={`${company.name} transporte des voyageurs en autocar au Maroc, avec une conviction : un bon voyage se construit sur la confiance.`}
        breadcrumbs={[{ name: "À propos", path: "/a-propos" }]}
        image="landscape"
      />

      <section aria-labelledby="mission-title" className="bg-paper py-24 sm:py-32">
        <div className="container-page grid grid-cols-1 gap-14 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading id="mission-title" eyebrow="Notre mission" title="Vous conduire plus loin, en toute sérénité." />
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
              <p>
                Prendre l&apos;autocar, c&apos;est confier une partie de sa journée — parfois de sa vie — à ceux qui conduisent.
                Notre rôle est d&apos;être à la hauteur de cette confiance, à chaque départ.
              </p>
              <p>
                Sécurité, respect du temps, confort et formation : ces quatre engagements orientent notre façon de travailler,
                de l&apos;agence jusqu&apos;à l&apos;arrivée.
              </p>
            </div>
            <PreviewNotice className="mt-8">
              Complétez l&apos;histoire de l&apos;entreprise (date de création, villes desservies, équipe…) uniquement avec des
              informations vérifiées, dans <code>src/config/company.ts</code> et cette page.
            </PreviewNotice>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
              <Image
                src={images.hero.src}
                alt={images.hero.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                style={{ objectPosition: "60% 50%" }}
              />
            </div>
            {company.foundingYear && <p className="mt-4 text-sm text-muted">Depuis {company.foundingYear}</p>}
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="values-title" className="grain relative bg-ink-950 py-24 text-white sm:py-32">
        <div className="container-page relative z-[2]">
          <Reveal>
            <SectionHeading id="values-title" tone="dark" eyebrow="Nos engagements" title="Ce qui nous guide." />
          </Reveal>
          <ul className="mt-14 grid gap-px overflow-hidden rounded-[2rem] bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar, index) => (
              <Reveal as="li" key={pillar.id} delay={0.06 * index} className="bg-ink-950 p-8">
                <span className="font-[family-name:var(--font-display)] text-sm tracking-[0.3em] text-carla-300">{pillar.number}</span>
                <h3 className="mt-6 font-[family-name:var(--font-display)] text-2xl font-light">{pillar.title}</h3>
                <p className="mt-3 text-ink-300">{pillar.headline}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="commitments-title" className="bg-paper py-24 sm:py-32">
        <div className="container-page">
          <Reveal>
            <SectionHeading id="commitments-title" eyebrow="Notre engagement" title="Une responsabilité partagée." />
          </Reveal>
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {commitments.map((c, index) => (
              <Reveal as="li" key={c.title} delay={0.06 * index} className="rounded-[1.5rem] bg-white p-8 ring-1 ring-line">
                <h3 className="font-[family-name:var(--font-display)] text-xl">{c.title}</h3>
                <p className="mt-3 text-muted">{c.text}</p>
              </Reveal>
            ))}
          </ul>
          <div className="mt-12 flex flex-wrap gap-3">
            <ButtonLink href="/services" variant="outline-dark">Nos services</ButtonLink>
            <ButtonLink href="/formation" variant="outline-dark">La formation</ButtonLink>
          </div>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
