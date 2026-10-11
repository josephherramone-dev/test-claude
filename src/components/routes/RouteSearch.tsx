"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { ArrowLeftRight, CalendarDays, MapPin, Navigation, Search } from "lucide-react";
import { buildPartnerSearchUrl, bookingConfig } from "@/config/booking";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export interface SearchableRoute {
  slug: string;
  origin: { slug: string; name: string };
  destination: { slug: string; name: string };
}

interface RouteSearchProps {
  routes: SearchableRoute[];
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Route finder. Matches a published route and opens its page; otherwise tells
 * the visitor honestly that no verified information is published and offers
 * the booking platform and customer service.
 */
export function RouteSearch({ routes, tone = "dark", className }: RouteSearchProps) {
  const router = useRouter();
  const id = useId();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  const cityMap = new Map<string, string>();
  routes.forEach((r) => {
    cityMap.set(r.origin.slug, r.origin.name);
    cityMap.set(r.destination.slug, r.destination.name);
  });
  const origins = [...new Map(routes.map((r) => [r.origin.slug, r.origin])).values()].sort((a, b) => a.name.localeCompare(b.name, "fr"));
  const destinations = [
    ...new Map(routes.filter((r) => !origin || r.origin.slug === origin).map((r) => [r.destination.slug, r.destination])).values(),
  ].sort((a, b) => a.name.localeCompare(b.name, "fr"));

  const today = new Date().toISOString().slice(0, 10);
  const dark = tone === "dark";
  const disabled = routes.length === 0;

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!origin || !destination) {
      setError("Choisissez une ville de départ et une ville d'arrivée.");
      return;
    }
    if (origin === destination) {
      setError("Les villes de départ et d'arrivée doivent être différentes.");
      return;
    }
    setError("");
    const match = routes.find((r) => r.origin.slug === origin && r.destination.slug === destination);
    track("route_search", { origin, destination, matched: Boolean(match), with_date: Boolean(date) });
    if (match) {
      router.push(`/trajets/${match.slug}${date ? `?date=${date}` : ""}`);
    } else {
      setNotFound(true);
    }
  };

  const swap = () => {
    setOrigin(destination);
    setDestination(origin);
    setNotFound(false);
  };

  const field = cn(
    "h-14 w-full appearance-none rounded-2xl ps-11 pe-4 text-[0.95rem] outline-none transition-colors",
    dark
      ? "bg-white/[0.06] text-white ring-1 ring-white/15 focus:ring-2 focus:ring-carla-300 [&>option]:text-ink-900"
      : "bg-white text-ink-900 ring-1 ring-line focus:ring-2 focus:ring-carla-600",
  );
  const label = cn("mb-2 block text-xs font-medium tracking-wider uppercase", dark ? "text-ink-300" : "text-muted");
  const icon = cn("pointer-events-none absolute start-4 top-1/2 size-4.5 -translate-y-1/2", dark ? "text-carla-300" : "text-carla-700");
  const partnerSearch = buildPartnerSearchUrl({ from: origin, to: destination, date });

  return (
    <div className={className}>
      <form
        onSubmit={onSubmit}
        noValidate
        aria-label="Rechercher un trajet"
        className={cn(
          "grid gap-4 rounded-[1.75rem] p-4 sm:p-5 md:grid-cols-[1fr_auto_1fr_0.8fr_auto] md:items-end",
          dark ? "glass-dark" : "bg-paper-2 ring-1 ring-line",
        )}
      >
        <div>
          <label htmlFor={`${id}-from`} className={label}>
            Départ
          </label>
          <div className="relative">
            <MapPin aria-hidden className={icon} />
            <select
              id={`${id}-from`}
              className={field}
              value={origin}
              disabled={disabled}
              onChange={(e) => {
                setOrigin(e.target.value);
                setDestination("");
                setNotFound(false);
              }}
            >
              <option value="">Ville de départ</option>
              {origins.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="button"
          onClick={swap}
          disabled={disabled}
          className={cn(
            "mx-auto flex size-11 items-center justify-center rounded-full transition-colors md:mb-1.5",
            dark ? "text-white ring-1 ring-white/20 hover:bg-white/10" : "text-ink-900 ring-1 ring-line hover:bg-white",
          )}
          aria-label="Inverser départ et arrivée"
        >
          <ArrowLeftRight aria-hidden className="size-4.5 rotate-90 md:rotate-0" />
        </button>
        <div>
          <label htmlFor={`${id}-to`} className={label}>
            Arrivée
          </label>
          <div className="relative">
            <Navigation aria-hidden className={icon} />
            <select
              id={`${id}-to`}
              className={field}
              value={destination}
              disabled={disabled}
              onChange={(e) => {
                setDestination(e.target.value);
                setNotFound(false);
              }}
            >
              <option value="">Ville d&apos;arrivée</option>
              {destinations.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor={`${id}-date`} className={label}>
            Date <span className="normal-case">(facultatif)</span>
          </label>
          <div className="relative">
            <CalendarDays aria-hidden className={icon} />
            <input
              id={`${id}-date`}
              type="date"
              min={today}
              value={date}
              disabled={disabled}
              onChange={(e) => setDate(e.target.value)}
              className={cn(field, dark && "[color-scheme:dark]")}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={disabled}
          className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-carla-600 px-7 font-medium text-white transition-colors hover:bg-carla-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Search aria-hidden className="size-5" />
          Rechercher
        </button>
      </form>

      <div aria-live="polite" className="mt-4 min-h-6 text-sm">
        {disabled && (
          <p className={dark ? "text-ink-300" : "text-muted"}>
            La recherche sera disponible dès la publication de nos trajets. En attendant, recherchez votre départ sur{" "}
            <a href={bookingConfig.partnerUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
              {bookingConfig.partnerName}
            </a>
            .
          </p>
        )}
        {error && <p className={dark ? "text-carla-300" : "text-carla-700"}>{error}</p>}
        {notFound && (
          <p className={dark ? "text-ink-200" : "text-ink-900"}>
            Nous n&apos;avons pas encore publié d&apos;informations vérifiées pour {cityMap.get(origin)} → {cityMap.get(destination)}.{" "}
            <a
              href={partnerSearch ?? bookingConfig.partnerUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("markoub_outbound_click", { location: "route_search" })}
              className="font-medium underline underline-offset-4"
            >
              Vérifier les disponibilités sur {bookingConfig.partnerName}
            </a>{" "}
            ou{" "}
            <Link href="/contact?sujet=trajets" className="font-medium underline underline-offset-4">
              contacter notre équipe
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
