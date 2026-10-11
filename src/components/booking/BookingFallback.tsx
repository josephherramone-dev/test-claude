import { CreditCard, MapPinned, Search, ShieldCheck, Ticket } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { TiltCard } from "@/components/ui/TiltCard";
import { bookingConfig } from "@/config/booking";

const steps = [
  { icon: MapPinned, title: "Choisissez votre trajet", text: "Ville de départ, ville d'arrivée et date du voyage." },
  { icon: Search, title: "Comparez les départs", text: "Les disponibilités et tarifs s'affichent en temps réel." },
  { icon: CreditCard, title: "Réglez en toute sécurité", text: `Le paiement est traité par ${bookingConfig.partnerName}.` },
];

/**
 * Booking panel used when the partner page cannot be embedded. Booking
 * continues on Markoub.ma in a new tab.
 */
export function BookingFallback({ reason = "not-embeddable" }: { reason?: "not-embeddable" | "embed-failed" }) {
  return (
    <TiltCard className="h-full" max={3}>
      <div className="relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 p-7 shadow-[0_40px_120px_-40px_rgb(0_0_0/0.8)] sm:p-10">
        <div aria-hidden className="absolute -top-24 -right-24 size-72 rounded-full bg-carla-500/25 blur-3xl" />
        <div aria-hidden className="absolute -bottom-32 -left-16 size-72 rounded-full bg-sand-400/10 blur-3xl" />

        <div className="relative">
          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs tracking-wider text-ink-200 uppercase ring-1 ring-white/10">
              <ShieldCheck aria-hidden className="size-3.5 text-carla-300" />
              Plateforme partenaire officielle
            </span>
            <Ticket aria-hidden className="size-7 text-carla-300/80" />
          </div>

          <p className="mt-8 font-[family-name:var(--font-display)] text-3xl font-light text-white sm:text-4xl">
            {bookingConfig.partnerName}
          </p>
          <p className="mt-3 max-w-md leading-relaxed text-ink-300">
            {reason === "embed-failed"
              ? "Le module de réservation n'a pas pu être chargé ici. Poursuivez votre réservation directement sur la plateforme partenaire."
              : "La recherche de départs, la réservation et le paiement de votre billet se poursuivent sur notre plateforme partenaire, dans un nouvel onglet."}
          </p>

          <ol className="mt-8 space-y-5">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <li key={title} className="flex gap-4">
                <span className="relative flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                  <Icon aria-hidden className="size-5 text-carla-300" />
                  <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-carla-600 text-[0.65rem] font-semibold text-white">
                    {index + 1}
                  </span>
                </span>
                <span>
                  <span className="block font-medium text-white">{title}</span>
                  <span className="block text-sm text-ink-300">{text}</span>
                </span>
              </li>
            ))}
          </ol>

          <ButtonLink
            href={bookingConfig.partnerUrl}
            size="lg"
            className="mt-10 w-full sm:w-auto"
            eventProps={{ location: "booking_panel" }}
          >
            Continuer sur {bookingConfig.partnerName}
          </ButtonLink>
          <p className="mt-4 text-xs leading-relaxed text-ink-400">
            Vous quittez le site de Carla Tamassint Transport. Les conditions de vente de {bookingConfig.partnerName} s&apos;appliquent.
            Ce site ne collecte aucune donnée de paiement.
          </p>
        </div>
      </div>
    </TiltCard>
  );
}
