import Link from "next/link";
import { ArrowRight, Clock3, MoveRight } from "lucide-react";
import { DemoBadge } from "@/components/ui/PreviewNotice";
import { routeSlug } from "@/lib/content";
import { cn, formatDuration } from "@/lib/utils";
import type { RouteEntry } from "@/types/content";

export function RouteCard({ route, tone = "light" }: { route: RouteEntry; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const departures = route.departures?.length ?? 0;
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col justify-between overflow-hidden rounded-[1.5rem] p-7 transition-all duration-500 ease-[var(--ease-cinematic)] hover:-translate-y-1",
        dark
          ? "bg-white/[0.04] ring-1 ring-white/10 hover:bg-white/[0.07] hover:ring-carla-300/40"
          : "bg-white ring-1 ring-line hover:shadow-[0_30px_60px_-30px_rgb(13_13_18/0.35)] hover:ring-carla-500/40",
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-3">
          <span className={cn("eyebrow text-[0.65rem]", dark ? "text-ink-400" : "text-muted")}>Trajet</span>
          {route.status === "demo" && <DemoBadge />}
        </div>
        <h3 className="mt-5 font-[family-name:var(--font-display)] text-2xl leading-tight font-light">
          <Link href={`/trajets/${routeSlug(route)}`} className="after:absolute after:inset-0">
            <span className="block">{route.origin.name}</span>
            <span className="mt-1 flex items-center gap-3">
              <MoveRight aria-hidden className="flip-rtl size-5 text-carla-500" />
              <span className="sr-only">vers</span>
              {route.destination.name}
            </span>
          </Link>
        </h3>
      </div>
      <div className={cn("mt-8 flex items-end justify-between gap-4 text-sm", dark ? "text-ink-300" : "text-muted")}>
        <div className="space-y-1">
          {route.durationMinutes ? (
            <p className="flex items-center gap-2">
              <Clock3 aria-hidden className="size-4" /> Environ {formatDuration(route.durationMinutes)}
            </p>
          ) : null}
          <p>{departures > 0 ? `${departures} horaire${departures > 1 ? "s" : ""} publié${departures > 1 ? "s" : ""}` : "Horaires sur demande"}</p>
        </div>
        <span
          aria-hidden
          className={cn(
            "flex size-11 items-center justify-center rounded-full transition-colors",
            dark ? "bg-white/10 group-hover:bg-carla-600" : "bg-paper group-hover:bg-carla-600 group-hover:text-white",
          )}
        >
          <ArrowRight className="flip-rtl size-5" />
        </span>
      </div>
    </article>
  );
}
