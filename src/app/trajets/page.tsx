import { PageHero } from "@/components/layout/PageHero";
import { RouteCard } from "@/components/routes/RouteCard";
import { RouteSearch } from "@/components/routes/RouteSearch";
import { RoutesEmptyState } from "@/components/routes/RoutesEmptyState";
import { ContactCta } from "@/components/sections/ContactCta";
import { PreviewNotice } from "@/components/ui/PreviewNotice";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getRoutes, routeSlug } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Trajets et horaires en autocar",
  description:
    "Consultez les trajets en autocar de Carla Tamassint Transport : villes de départ et d'arrivée, horaires confirmés et réservation en ligne via Markoub.ma.",
  path: "/trajets",
});

export default function RoutesPage() {
  const routes = getRoutes();
  const searchable = routes.map((r) => ({ slug: routeSlug(r), origin: r.origin, destination: r.destination }));
  const byOrigin = [...new Map(routes.map((r) => [r.origin.slug, r.origin])).values()]
    .sort((a, b) => a.name.localeCompare(b.name, "fr"))
    .map((city) => ({ city, routes: routes.filter((r) => r.origin.slug === city.slug) }));

  return (
    <>
      <PageHero
        eyebrow="Trajets & destinations"
        title="Trouvez votre trajet."
        lead="Choisissez votre ville de départ et d'arrivée pour consulter les informations du trajet et réserver votre billet."
        breadcrumbs={[{ name: "Trajets", path: "/trajets" }]}
        image="time"
      >
        <RouteSearch routes={searchable} tone="dark" />
      </PageHero>

      <section aria-labelledby="all-routes" className="bg-paper py-20 sm:py-28">
        <div className="container-page">
          <Reveal>
            <SectionHeading id="all-routes" eyebrow="Nos lignes" title="Tous les trajets" />
          </Reveal>
          <PreviewNotice className="mt-8">
            Les trajets marqués « Démonstration » sont fictifs et n&apos;apparaissent pas en production. Renseignez les trajets
            réels dans <code>src/data/routes.ts</code> : chaque trajet vérifié obtient automatiquement sa page indexable.
          </PreviewNotice>
          {routes.length === 0 ? (
            <div className="mt-10">
              <RoutesEmptyState />
            </div>
          ) : (
            <div className="mt-12 space-y-14">
              {byOrigin.map(({ city, routes: cityRoutes }) => (
                <div key={city.slug}>
                  <h3 className="eyebrow border-b border-line pb-4 text-muted">Au départ de {city.name}</h3>
                  <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {cityRoutes.map((route, index) => (
                      <Reveal as="li" key={routeSlug(route)} delay={0.05 * index}>
                        <RouteCard route={route} />
                      </Reveal>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <ContactCta title="Vous ne trouvez pas votre trajet ?" text="Notre équipe peut vous renseigner sur les villes desservies et les départs." />
    </>
  );
}
