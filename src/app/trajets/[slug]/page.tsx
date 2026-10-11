import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarCheck, Clock3, MapPin, MoveRight, Navigation, Ticket } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { RouteCard } from "@/components/routes/RouteCard";
import { RouteTimetable } from "@/components/routes/RouteTimetable";
import { ContactCta } from "@/components/sections/ContactCta";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { DemoBadge, PreviewNotice } from "@/components/ui/PreviewNotice";
import { bookingConfig, buildPartnerSearchUrl } from "@/config/booking";
import { agencyMapsUrl, getAgenciesInCities, getRelatedRoutes, getRouteBySlug, getRoutes, routeSlug } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { formatDate, formatDuration } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ date?: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getRoutes().map((route) => ({ slug: routeSlug(route) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const route = getRouteBySlug(slug);
  if (!route) return {};
  const name = `${route.origin.name} – ${route.destination.name}`;
  const duration = route.durationMinutes ? ` Durée indicative : ${formatDuration(route.durationMinutes)}.` : "";
  return pageMetadata({
    title: `Autocar ${name} : horaires et réservation`,
    description: `Trajet en autocar ${name} avec Carla Tamassint Transport.${duration} Consultez les informations du trajet et réservez votre billet en ligne via Markoub.ma.`,
    path: `/trajets/${slug}`,
    noindex: route.status !== "verified",
  });
}

export default async function RoutePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { date } = await searchParams;
  const route = getRouteBySlug(slug);
  if (!route) notFound();

  const name = `${route.origin.name} → ${route.destination.name}`;
  const validDate = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined;
  const bookingUrl =
    route.bookingUrl ??
    buildPartnerSearchUrl({ from: route.origin.slug, to: route.destination.slug, date: validDate }) ??
    bookingConfig.partnerUrl;
  const related = getRelatedRoutes(route);
  const agencies = getAgenciesInCities([route.origin.slug, route.destination.slug]);
  const reverse = getRouteBySlug(`${route.destination.slug}-${route.origin.slug}`);

  return (
    <>
      <PageHero
        eyebrow="Trajet en autocar"
        title={
          <span className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {route.origin.name}
            <MoveRight aria-hidden className="flip-rtl size-10 text-carla-400 sm:size-14" />
            <span className="sr-only">vers</span>
            {route.destination.name}
          </span>
        }
        lead={route.description ?? `Informations pratiques et réservation pour votre trajet ${route.origin.name} – ${route.destination.name}.`}
        breadcrumbs={[
          { name: "Trajets", path: "/trajets" },
          { name: `${route.origin.name} – ${route.destination.name}`, path: `/trajets/${slug}` },
        ]}
        image="time"
      >
        <div className="flex flex-wrap items-center gap-3">
          <ButtonLink href={bookingUrl} size="lg" event="booking_cta_click" eventProps={{ location: "route_page", route: slug }} icon={<Ticket aria-hidden className="size-5" />}>
            Réserver ce trajet
          </ButtonLink>
          {route.status === "demo" && <DemoBadge className="ms-2" />}
        </div>
      </PageHero>

      <section aria-labelledby="route-info" className="bg-paper py-20 sm:py-28">
        <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <PreviewNotice className="mb-8">
              Cette fiche est un exemple fictif (statut « demo »). Elle n&apos;est ni publiée en production ni indexée.
            </PreviewNotice>
            <h2 id="route-info" className="display-md">Informations du trajet</h2>

            <dl className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-6 ring-1 ring-line">
                <dt className="flex items-center gap-2 text-sm text-muted">
                  <MapPin aria-hidden className="size-4 text-carla-600" /> Départ
                </dt>
                <dd className="mt-2 font-[family-name:var(--font-display)] text-2xl">{route.origin.name}</dd>
              </div>
              <div className="rounded-2xl bg-white p-6 ring-1 ring-line">
                <dt className="flex items-center gap-2 text-sm text-muted">
                  <Navigation aria-hidden className="size-4 text-carla-600" /> Arrivée
                </dt>
                <dd className="mt-2 font-[family-name:var(--font-display)] text-2xl">{route.destination.name}</dd>
              </div>
              <div className="rounded-2xl bg-white p-6 ring-1 ring-line">
                <dt className="flex items-center gap-2 text-sm text-muted">
                  <Clock3 aria-hidden className="size-4 text-carla-600" /> Durée indicative
                </dt>
                <dd className="mt-2 font-[family-name:var(--font-display)] text-2xl">
                  {route.durationMinutes ? formatDuration(route.durationMinutes) : <span className="text-lg text-muted">À confirmer</span>}
                </dd>
              </div>
            </dl>

            <h3 className="mt-14 font-[family-name:var(--font-display)] text-2xl">Horaires</h3>
            {route.departures?.length ? (
              <div className="mt-5">
                <RouteTimetable departures={route.departures} caption={`Horaires ${name}`} />
                <p className="mt-4 text-sm text-muted">
                  Horaires donnés à titre indicatif
                  {route.lastVerified ? `, vérifiés le ${formatDate(route.lastVerified)}` : ""}. Confirmez votre départ au moment
                  de la réservation ou auprès de l&apos;agence.
                </p>
              </div>
            ) : (
              <p className="mt-4 max-w-xl text-muted">
                Les horaires de ce trajet ne sont pas encore publiés sur ce site. Les départs disponibles s&apos;affichent lors de
                votre recherche sur {bookingConfig.partnerName} ; notre équipe peut aussi vous renseigner.
              </p>
            )}

            {route.stops?.length ? (
              <>
                <h3 className="mt-14 font-[family-name:var(--font-display)] text-2xl">Arrêts</h3>
                <ol className="mt-6 space-y-0">
                  {[route.origin.name, ...route.stops, route.destination.name].map((stop, index, all) => (
                    <li key={`${stop}-${index}`} className="relative flex items-center gap-4 pb-6 last:pb-0">
                      {index < all.length - 1 && <span aria-hidden className="absolute start-[0.6rem] top-6 h-full w-px bg-line" />}
                      <span
                        aria-hidden
                        className={
                          index === 0 || index === all.length - 1
                            ? "relative size-5 rounded-full border-4 border-carla-600 bg-white"
                            : "relative ms-1 size-3 rounded-full bg-ink-300"
                        }
                      />
                      <span className={index === 0 || index === all.length - 1 ? "font-medium" : "text-muted"}>{stop}</span>
                    </li>
                  ))}
                </ol>
              </>
            ) : null}
          </div>

          <aside aria-label="Réservation" className="lg:pt-20">
            <div className="sticky top-28 rounded-[2rem] bg-ink-950 p-8 text-white">
              <CalendarCheck aria-hidden className="size-8 text-carla-300" />
              <p className="mt-6 font-[family-name:var(--font-display)] text-2xl font-light">Réservez votre billet</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-300">
                Disponibilités et tarifs en temps réel sur {bookingConfig.partnerName}, notre plateforme de réservation partenaire.
                {validDate ? ` Date choisie : ${formatDate(validDate)}.` : ""}
              </p>
              <ButtonLink href={bookingUrl} className="mt-8 w-full" event="booking_cta_click" eventProps={{ location: "route_aside", route: slug }}>
                Réserver sur {bookingConfig.partnerName}
              </ButtonLink>
              <Link href="/contact?sujet=trajets" className="mt-4 block text-center text-sm text-ink-300 underline underline-offset-4 hover:text-white">
                Une question sur ce trajet ?
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {(agencies.length > 0 || related.length > 0 || reverse) && (
        <section aria-label="Pour aller plus loin" className="bg-paper-2 py-20">
          <div className="container-page space-y-14">
            {agencies.length > 0 && (
              <div>
                <h2 className="display-md">Agences à proximité</h2>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {agencies.map((agency) => {
                    const maps = agencyMapsUrl(agency);
                    return (
                      <li key={agency.id} className="rounded-2xl bg-white p-6 ring-1 ring-line">
                        <p className="eyebrow text-carla-700">{agency.city.name}</p>
                        <p className="mt-2 font-[family-name:var(--font-display)] text-xl">{agency.name}</p>
                        {agency.address && <p className="mt-1 text-sm text-muted">{agency.address}</p>}
                        <div className="mt-4 flex gap-4 text-sm font-medium">
                          <Link href={`/agences#${agency.id}`} className="underline underline-offset-4">
                            Détails
                          </Link>
                          {maps && (
                            <a href={maps} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                              Itinéraire
                            </a>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {(reverse || related.length > 0) && (
              <div>
                <h2 className="display-md">Autres trajets</h2>
                <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {[...(reverse ? [reverse] : []), ...related.filter((r) => r !== reverse)].slice(0, 3).map((r) => (
                    <li key={routeSlug(r)}>
                      <RouteCard route={r} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Link href="/trajets" className="inline-flex items-center gap-2 font-medium underline-offset-4 hover:underline">
              Voir tous les trajets <ArrowRight aria-hidden className="flip-rtl size-4" />
            </Link>
          </div>
        </section>
      )}

      <ContactCta />
    </>
  );
}
