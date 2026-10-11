"use client";

import { useMemo, useState } from "react";
import { Clock, MapPin, Navigation, Phone, Search, Ticket } from "lucide-react";
import { DemoBadge } from "@/components/ui/PreviewNotice";
import { track } from "@/lib/analytics";
import { cn, normalizeText, telHref } from "@/lib/utils";
import type { Agency } from "@/types/content";

export interface AgencyView extends Agency {
  directionsUrl: string | null;
}

function MapPreview({ agency }: { agency: AgencyView }) {
  if (!agency.coordinates || agency.status !== "verified") return null;
  const { lat, lng } = agency.coordinates;
  const d = 0.006;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d}%2C${lat - d}%2C${lng + d}%2C${lat + d}&layer=mapnik&marker=${lat}%2C${lng}`;
  return (
    <iframe
      title={`Carte : ${agency.name}`}
      src={src}
      loading="lazy"
      className="h-48 w-full rounded-2xl border-0 grayscale-[0.4]"
      referrerPolicy="no-referrer"
    />
  );
}

function AgencyCard({ agency }: { agency: AgencyView }) {
  const missing = <span className="text-muted italic">Non communiqué</span>;
  return (
    <article id={agency.id} className="flex scroll-mt-28 flex-col gap-6 rounded-[1.5rem] bg-white p-7 ring-1 ring-line">
      <header>
        <div className="flex items-center justify-between gap-3">
          <p className="eyebrow text-carla-700">{agency.city.name}</p>
          {agency.status === "demo" && <DemoBadge />}
        </div>
        <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-light">{agency.name}</h3>
      </header>
      <MapPreview agency={agency} />
      <dl className="grid gap-4 text-[0.95rem]">
        <div className="flex gap-3">
          <dt>
            <MapPin aria-hidden className="mt-0.5 size-5 text-carla-600" />
            <span className="sr-only">Adresse</span>
          </dt>
          <dd>{agency.address ?? missing}</dd>
        </div>
        <div className="flex gap-3">
          <dt>
            <Phone aria-hidden className="mt-0.5 size-5 text-carla-600" />
            <span className="sr-only">Téléphone</span>
          </dt>
          <dd>
            {agency.phone ? (
              <a href={telHref(agency.phone)} className="underline-offset-4 hover:underline">
                {agency.phone}
              </a>
            ) : (
              missing
            )}
          </dd>
        </div>
        <div className="flex gap-3">
          <dt>
            <Clock aria-hidden className="mt-0.5 size-5 text-carla-600" />
            <span className="sr-only">Horaires d&apos;ouverture</span>
          </dt>
          <dd>
            {agency.hours?.length ? (
              <ul>
                {agency.hours.map((h) => (
                  <li key={h.days}>
                    <span className="text-muted">{h.days} :</span> {h.hours}
                  </li>
                ))}
              </ul>
            ) : (
              missing
            )}
          </dd>
        </div>
        <div className="flex gap-3">
          <dt>
            <Ticket aria-hidden className="mt-0.5 size-5 text-carla-600" />
            <span className="sr-only">Billetterie</span>
          </dt>
          <dd>{agency.ticketInfo ?? <span className="text-muted">Renseignez-vous auprès de l&apos;agence.</span>}</dd>
        </div>
      </dl>
      <div className="mt-auto flex flex-wrap gap-3 border-t border-line pt-6">
        {agency.directionsUrl && (
          <a
            href={agency.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("agency_directions_click", { agency: agency.id })}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-ink-900 px-5 text-sm font-medium text-white hover:bg-ink-700"
          >
            <Navigation aria-hidden className="size-4" /> Itinéraire
            <span className="sr-only"> vers {agency.name} sur Google Maps (nouvel onglet)</span>
          </a>
        )}
        {agency.phone && (
          <a
            href={telHref(agency.phone)}
            className="inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium ring-1 ring-line hover:bg-paper"
          >
            <Phone aria-hidden className="size-4" /> Appeler
          </a>
        )}
      </div>
    </article>
  );
}

export function AgencyDirectory({ agencies }: { agencies: AgencyView[] }) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState<string | null>(null);

  const cities = useMemo(
    () => [...new Map(agencies.map((a) => [a.city.slug, a.city])).values()].sort((a, b) => a.name.localeCompare(b.name, "fr")),
    [agencies],
  );

  const filtered = useMemo(() => {
    const q = normalizeText(query);
    return agencies.filter((a) => {
      if (city && a.city.slug !== city) return false;
      if (!q) return true;
      return normalizeText(`${a.name} ${a.city.name} ${a.address ?? ""}`).includes(q);
    });
  }, [agencies, city, query]);

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <label htmlFor="agency-search" className="sr-only">
            Rechercher une agence
          </label>
          <Search aria-hidden className="pointer-events-none absolute start-4 top-1/2 size-4.5 -translate-y-1/2 text-muted" />
          <input
            id="agency-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ville, nom d'agence, adresse…"
            className="h-12 w-full rounded-full bg-white ps-11 pe-4 ring-1 ring-line outline-none focus:ring-2 focus:ring-carla-600"
          />
        </div>
        <div role="group" aria-label="Filtrer par ville" className="flex flex-wrap gap-2">
          {[{ slug: null as string | null, name: "Toutes les villes" }, ...cities].map((c) => {
            const active = city === c.slug;
            return (
              <button
                key={c.slug ?? "all"}
                type="button"
                aria-pressed={active}
                onClick={() => setCity(c.slug)}
                className={cn(
                  "h-10 rounded-full px-4 text-sm transition-colors",
                  active ? "bg-ink-900 text-white" : "bg-white text-ink-900 ring-1 ring-line hover:ring-ink-900",
                )}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      <p aria-live="polite" className="mt-6 text-sm text-muted">
        {filtered.length} {filtered.length > 1 ? "agences affichées" : "agence affichée"}
      </p>

      {filtered.length > 0 ? (
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((agency) => (
            <AgencyCard key={agency.id} agency={agency} />
          ))}
        </div>
      ) : (
        <p className="mt-6 rounded-2xl bg-white p-8 text-center text-muted ring-1 ring-line">
          Aucune agence ne correspond à votre recherche.
        </p>
      )}
    </div>
  );
}
