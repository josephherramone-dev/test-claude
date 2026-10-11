import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { DemoBadge, PreviewNotice } from "@/components/ui/PreviewNotice";
import { getRoutes, routeSlug } from "@/lib/content";
import { formatDuration } from "@/lib/utils";

/**
 * Compact route information (departure, arrival, duration, schedule) used in
 * the « Temps » pillar. Shows only routes with published departures.
 */
export function RouteInfoBlock() {
  const routes = getRoutes().filter((r) => r.departures?.length).slice(0, 3);
  if (routes.length === 0) {
    return (
      <PreviewNotice tone="dark" className="mt-10">
        Ce bloc affichera départ, arrivée, durée et horaires des trajets dès qu&apos;ils seront renseignés dans{" "}
        <code>src/data/routes.ts</code>.
      </PreviewNotice>
    );
  }
  return (
    <div className="mt-10 overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-6 py-4">
        <p className="eyebrow text-ink-300">Horaires publiés</p>
        {routes.some((r) => r.status === "demo") && <DemoBadge />}
      </div>
      <ul className="divide-y divide-white/10">
        {routes.map((route) => {
          const first = route.departures![0]!;
          return (
            <li key={routeSlug(route)}>
              <Link href={`/trajets/${routeSlug(route)}`} className="group flex items-center gap-4 px-5 py-5 hover:bg-white/5 sm:gap-5 sm:px-6">
                <div className="grid min-w-0 flex-1 grid-cols-[auto_1fr_auto] items-center gap-4">
                  <div>
                    <p className="font-[family-name:var(--font-display)] text-2xl tabular-nums">{first.time}</p>
                    <p className="text-xs text-ink-300">{route.origin.name}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-xs text-ink-400">
                    {route.durationMinutes ? (
                      <span className="flex items-center gap-1">
                        <Clock3 aria-hidden className="size-3.5" /> {formatDuration(route.durationMinutes)}
                      </span>
                    ) : null}
                    <span aria-hidden className="road-line w-full opacity-70" />
                    {first.days && <span>{first.days}</span>}
                  </div>
                  <div className="text-end">
                    <p className="font-[family-name:var(--font-display)] text-2xl tabular-nums">{first.arrival ?? "—"}</p>
                    <p className="text-xs text-ink-300">{route.destination.name}</p>
                  </div>
                </div>
                <ArrowRight aria-hidden className="flip-rtl size-5 text-carla-300 transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
