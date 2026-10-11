import { BadgeCheck, Building2, Headphones } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { bookingConfig } from "@/config/booking";
import { BookingEmbed } from "./BookingEmbed";
import { BookingFallback } from "./BookingFallback";

export function BookingSection({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const embedUrl = bookingConfig.embedUrl;
  return (
    <section id="reserver" aria-labelledby="booking-title" className="grain relative overflow-hidden bg-ink-900 py-24 text-white sm:py-32">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-carla-500/50 to-transparent" />
      <div className="container-page relative z-[2]">
        {embedUrl ? (
          <>
            <Reveal>
              <SectionHeading
                id="booking-title"
                as={headingLevel}
                tone="dark"
                align="center"
                eyebrow="Billetterie en ligne"
                title="Réservez votre billet en ligne"
                lead={`Recherchez votre départ et réservez via notre partenaire ${bookingConfig.partnerName}.`}
              />
            </Reveal>
            <div className="mx-auto mt-14 max-w-5xl">
              <BookingEmbed src={embedUrl} />
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
            <Reveal>
              <SectionHeading
                id="booking-title"
                as={headingLevel}
                tone="dark"
                eyebrow="Billetterie en ligne"
                title="Réservez votre billet en ligne"
                lead={`Nos billets se réservent en ligne sur ${bookingConfig.partnerName}, la plateforme marocaine de réservation de billets d'autocar. Quelques minutes suffisent pour choisir votre départ et régler votre voyage.`}
              />
              <ul className="mt-10 space-y-4 text-ink-200">
                <li className="flex gap-3">
                  <BadgeCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-carla-300" />
                  Disponibilités et tarifs affichés au moment de votre recherche.
                </li>
                <li className="flex gap-3">
                  <Building2 aria-hidden className="mt-0.5 size-5 shrink-0 text-carla-300" />
                  <span>
                    Vous préférez le guichet ?{" "}
                    <Link href="/agences" className="text-white underline underline-offset-4 hover:text-carla-300">
                      Consultez nos agences
                    </Link>
                    .
                  </span>
                </li>
                <li className="flex gap-3">
                  <Headphones aria-hidden className="mt-0.5 size-5 shrink-0 text-carla-300" />
                  <span>
                    Une question avant de réserver ?{" "}
                    <Link href="/contact?sujet=billets" className="text-white underline underline-offset-4 hover:text-carla-300">
                      Contactez notre équipe
                    </Link>
                    .
                  </span>
                </li>
              </ul>
            </Reveal>
            <Reveal delay={0.15}>
              <BookingFallback />
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}
