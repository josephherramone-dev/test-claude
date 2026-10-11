import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Wordmark } from "@/components/brand/Wordmark";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { bookingConfig } from "@/config/booking";
import { company, socialEntries } from "@/config/company";
import { footerNav } from "@/config/navigation";
import { t } from "@/i18n";
import { telHref } from "@/lib/utils";

export function Footer() {
  const socials = socialEntries();
  const { contact } = company;
  return (
    <footer className="grain relative overflow-hidden bg-ink-950 text-ink-300">
      <div aria-hidden className="road-line opacity-60" />
      <div className="container-page relative z-[2] py-20">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Wordmark withSignature className="text-xl" />
            <p className="mt-8 max-w-sm leading-relaxed">
              Transport de voyageurs en autocar au Maroc. Réservation en ligne via notre partenaire {bookingConfig.partnerName}.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/reservation" event="booking_cta_click" eventProps={{ location: "footer" }}>
                {t.cta.book}
              </ButtonLink>
              <ButtonLink href="/contact" variant="outline-light">
                {t.cta.contact}
              </ButtonLink>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {footerNav.map((group) => (
              <div key={group.title}>
                <h2 className="eyebrow text-white">{group.title}</h2>
                <ul className="mt-5 space-y-3">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="transition-colors hover:text-white">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {(contact.phone || contact.email || contact.address || socials.length > 0) && (
          <div className="mt-16 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/10 pt-10 text-sm">
            {contact.phone && (
              <a href={telHref(contact.phone)} className="inline-flex items-center gap-2 hover:text-white">
                <Phone aria-hidden className="size-4 text-carla-300" /> {contact.phoneDisplay ?? contact.phone}
              </a>
            )}
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-2 hover:text-white">
                <Mail aria-hidden className="size-4 text-carla-300" /> {contact.email}
              </a>
            )}
            {contact.address && (
              <span className="inline-flex items-center gap-2">
                <MapPin aria-hidden className="size-4 text-carla-300" /> {contact.address}
                {contact.city ? `, ${contact.city}` : ""}
              </span>
            )}
            {socials.map((s) => (
              <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                {s.label}
              </a>
            ))}
          </div>
        )}

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {company.legalName ?? company.name}. Tous droits réservés.
          </p>
          <p>
            Les billets sont vendus et payés sur {bookingConfig.partnerName}. Ce site ne collecte aucune donnée de paiement.
          </p>
        </div>
      </div>
    </footer>
  );
}
