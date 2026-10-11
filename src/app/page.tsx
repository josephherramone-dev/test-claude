import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GraduationCap, MapPin } from "lucide-react";
import { BookingSection } from "@/components/booking/BookingSection";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { Hero } from "@/components/home/Hero";
import { PillarsShowcase } from "@/components/pillars/PillarsShowcase";
import { RouteCard } from "@/components/routes/RouteCard";
import { RouteSearch } from "@/components/routes/RouteSearch";
import { RoutesEmptyState } from "@/components/routes/RoutesEmptyState";
import { ContactCta } from "@/components/sections/ContactCta";
import { Testimonials } from "@/components/testimonials/Testimonials";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { images } from "@/config/images";
import { faqEntries } from "@/data/faq";
import { pillars } from "@/data/pillars";
import { getAgencies, getRoutes, routeSlug } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = {
  ...pageMetadata({
    title: "Carla Tamassint Transport — Voyagez en autocar au Maroc en toute confiance",
    description:
      "Transport de voyageurs en autocar au Maroc : sécurité, ponctualité et confort. Consultez nos trajets et agences, réservez votre billet en ligne via Markoub.ma.",
    path: "/",
  }),
  title: { absolute: "Carla Tamassint Transport — Voyagez en autocar au Maroc en toute confiance" },
};

export default function HomePage() {
  const routes = getRoutes();
  const agencies = getAgencies();
  const searchable = routes.map((r) => ({ slug: routeSlug(r), origin: r.origin, destination: r.destination }));
  const homeFaq = faqEntries.filter((f) => ["reserver", "horaires", "agence", "bagages", "formation"].includes(f.id));

  return (
    <>
      <Hero />

      {/* Manifesto */}
      <section aria-labelledby="manifesto-title" className="bg-paper py-24 sm:py-36">
        <div className="container-page grid grid-cols-1 gap-14 lg:grid-cols-[1.25fr_1fr] lg:items-end">
          <Reveal>
            <p className="eyebrow text-carla-700">Carla Tamassint Transport</p>
            <h2 id="manifesto-title" className="display-lg mt-6 text-ink-900">
              Relier les villes du Maroc, <span className="text-muted">avec l&apos;exigence d&apos;un service soigné.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-lg leading-relaxed text-muted">
              Chaque départ engage notre responsabilité : celle de vous conduire à destination en sécurité, dans les meilleures
              conditions et dans le respect de votre temps. C&apos;est l&apos;esprit de notre signature, peinte sur nos autocars :
            </p>
            <p className="mt-4 font-[family-name:var(--font-script)] text-5xl text-carla-700">Travel in style</p>
          </Reveal>
        </div>
      </section>

      {/* Four pillars */}
      <section aria-labelledby="pillars-title" className="bg-paper pb-24 sm:pb-32">
        <div className="container-page">
          <Reveal className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading id="pillars-title" eyebrow="Nos engagements" title="Quatre piliers, une même exigence." />
            <ButtonLink href="/services" variant="outline-dark" className="self-start sm:self-auto">
              Tous nos services
            </ButtonLink>
          </Reveal>
          <Reveal delay={0.1}>
            <PillarsShowcase pillars={pillars} />
          </Reveal>
        </div>
      </section>

      <BookingSection />

      {/* Routes */}
      <section aria-labelledby="routes-title" className="bg-paper py-24 sm:py-32">
        <div className="container-page">
          <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              id="routes-title"
              eyebrow="Trajets & destinations"
              title="Où souhaitez-vous aller ?"
              lead="Retrouvez nos trajets, les horaires confirmés et l'accès direct à la réservation."
            />
            <ButtonLink href="/trajets" variant="outline-dark" className="self-start sm:self-auto">
              Tous les trajets
            </ButtonLink>
          </Reveal>
          <Reveal delay={0.1} className="mt-12">
            <RouteSearch routes={searchable} tone="light" />
          </Reveal>
          {routes.length > 0 ? (
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {routes.slice(0, 6).map((route, index) => (
                <Reveal as="li" key={routeSlug(route)} delay={0.06 * index}>
                  <RouteCard route={route} />
                </Reveal>
              ))}
            </ul>
          ) : (
            <div className="mt-10">
              <RoutesEmptyState />
            </div>
          )}
        </div>
      </section>

      {/* Agencies & training */}
      <section aria-label="Agences et formation" className="bg-paper pb-24 sm:pb-32">
        <div className="container-page grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Reveal>
            <article className="relative flex h-full flex-col justify-between overflow-hidden rounded-[2rem] bg-white p-10 ring-1 ring-line sm:p-12">
              <div>
                <MapPin aria-hidden className="size-8 text-carla-600" />
                <h2 className="display-md mt-8">Nos agences et points de vente</h2>
                <p className="mt-4 max-w-md text-muted">
                  Adresses, horaires d&apos;ouverture et itinéraires pour acheter votre billet ou vous renseigner au guichet.
                </p>
              </div>
              <Link href="/agences" className="group mt-10 inline-flex items-center gap-2 font-medium text-ink-900 after:absolute after:inset-0">
                {agencies.length > 0 ? "Trouver une agence" : "Voir les points de vente"}
                <ArrowRight aria-hidden className="flip-rtl size-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </article>
          </Reveal>
          <Reveal delay={0.1}>
            <article className="grain relative flex h-full min-h-80 flex-col justify-between overflow-hidden rounded-[2rem] bg-ink-950 p-10 text-white sm:p-12">
              <Image
                src={images.training.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover opacity-35"
                style={{ objectPosition: images.training.position }}
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/30" />
              <div className="relative z-[2]">
                <GraduationCap aria-hidden className="size-8 text-carla-300" />
                <h2 className="display-md mt-8">Formation des conducteurs</h2>
                <p className="mt-4 max-w-md text-ink-300">
                  Former aujourd&apos;hui les professionnels de la route de demain. Découvrez notre démarche et faites part de votre intérêt.
                </p>
              </div>
              <Link href="/formation" className="group relative z-[2] mt-10 inline-flex items-center gap-2 font-medium after:absolute after:inset-0">
                Découvrir la formation
                <ArrowRight aria-hidden className="flip-rtl size-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </article>
          </Reveal>
        </div>
      </section>

      <Testimonials />

      {/* FAQ */}
      <section aria-labelledby="faq-title" className="bg-paper-2 py-24 sm:py-32">
        <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.5fr]">
          <Reveal>
            <SectionHeading id="faq-title" eyebrow="Questions fréquentes" title="Bon à savoir avant de partir." />
            <ButtonLink href="/faq" variant="outline-dark" className="mt-10">
              Toutes les questions
            </ButtonLink>
          </Reveal>
          <Reveal delay={0.1}>
            <FaqAccordion entries={homeFaq} defaultOpen="reserver" />
          </Reveal>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
