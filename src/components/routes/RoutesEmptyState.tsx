import { Route } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { bookingConfig } from "@/config/booking";

/** Shown when no verified route has been published yet. */
export function RoutesEmptyState({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <div className={dark ? "rounded-[2rem] bg-white/[0.04] p-10 ring-1 ring-white/10" : "rounded-[2rem] bg-white p-10 ring-1 ring-line"}>
      <Route aria-hidden className="size-8 text-carla-500" />
      <p className="mt-5 font-[family-name:var(--font-display)] text-2xl font-light">Nos lignes seront bientôt présentées ici.</p>
      <p className={dark ? "mt-3 max-w-xl text-ink-300" : "mt-3 max-w-xl text-muted"}>
        En attendant la publication de nos fiches trajets, recherchez votre départ sur {bookingConfig.partnerName} ou
        interrogez notre équipe sur les villes desservies.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href={bookingConfig.partnerUrl} eventProps={{ location: "routes_empty" }}>
          Rechercher sur {bookingConfig.partnerName}
        </ButtonLink>
        <ButtonLink href="/contact?sujet=trajets" variant={dark ? "outline-light" : "outline-dark"}>
          Interroger notre équipe
        </ButtonLink>
      </div>
    </div>
  );
}
