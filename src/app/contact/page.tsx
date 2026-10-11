import { Suspense } from "react";
import Link from "next/link";
import { Briefcase, Clock, GraduationCap, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactFormWithTopic } from "@/components/contact/ContactFormWithTopic";
import { InquiryForm } from "@/components/contact/InquiryForm";
import { PageHero } from "@/components/layout/PageHero";
import { PreviewNotice } from "@/components/ui/PreviewNotice";
import { Reveal } from "@/components/ui/Reveal";
import { company, socialEntries } from "@/config/company";
import { isDeliveryConfigured } from "@/lib/inquiry-delivery";
import { pageMetadata } from "@/lib/seo";
import { telHref, whatsappHref } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Contact — Service client",
  description:
    "Contactez Carla Tamassint Transport : billets, trajets, agences, formation des conducteurs ou partenariat. Formulaire de contact et coordonnées du service client.",
  path: "/contact",
});

export default function ContactPage() {
  const { contact } = company;
  const socials = socialEntries();
  const deliveryConfigured = isDeliveryConfigured();
  const hasDetails = Boolean(contact.phone || contact.email || contact.address || contact.whatsapp);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Parlons de votre voyage."
        lead="Une question sur un billet, un trajet, une agence, la formation ou un partenariat ? Écrivez-nous, notre équipe vous répondra."
        breadcrumbs={[{ name: "Contact", path: "/contact" }]}
        image="security"
      />

      <section aria-label="Formulaire et coordonnées" className="bg-paper py-20 sm:py-28">
        <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <Reveal>
            <h2 className="display-md">Nos coordonnées</h2>
            {hasDetails ? (
              <ul className="mt-8 space-y-5">
                {contact.phone && (
                  <li>
                    <a href={telHref(contact.phone)} className="group flex items-center gap-4">
                      <span className="flex size-12 items-center justify-center rounded-full bg-white ring-1 ring-line group-hover:ring-carla-600">
                        <Phone aria-hidden className="size-5 text-carla-600" />
                      </span>
                      <span>
                        <span className="block text-sm text-muted">Téléphone</span>
                        <span className="text-lg">{contact.phoneDisplay ?? contact.phone}</span>
                      </span>
                    </a>
                  </li>
                )}
                {contact.whatsapp && (
                  <li>
                    <a href={whatsappHref(contact.whatsapp)} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4">
                      <span className="flex size-12 items-center justify-center rounded-full bg-white ring-1 ring-line group-hover:ring-carla-600">
                        <MessageCircle aria-hidden className="size-5 text-carla-600" />
                      </span>
                      <span>
                        <span className="block text-sm text-muted">WhatsApp</span>
                        <span className="text-lg">Écrire sur WhatsApp</span>
                      </span>
                    </a>
                  </li>
                )}
                {contact.email && (
                  <li>
                    <a href={`mailto:${contact.email}`} className="group flex items-center gap-4">
                      <span className="flex size-12 items-center justify-center rounded-full bg-white ring-1 ring-line group-hover:ring-carla-600">
                        <Mail aria-hidden className="size-5 text-carla-600" />
                      </span>
                      <span>
                        <span className="block text-sm text-muted">E-mail</span>
                        <span className="text-lg">{contact.email}</span>
                      </span>
                    </a>
                  </li>
                )}
                {contact.address && (
                  <li className="flex items-center gap-4">
                    <span className="flex size-12 items-center justify-center rounded-full bg-white ring-1 ring-line">
                      <MapPin aria-hidden className="size-5 text-carla-600" />
                    </span>
                    <span>
                      <span className="block text-sm text-muted">Adresse</span>
                      {contact.address}
                      {contact.city ? `, ${contact.city}` : ""}
                    </span>
                  </li>
                )}
                {contact.customerServiceHours && (
                  <li className="flex items-center gap-4">
                    <span className="flex size-12 items-center justify-center rounded-full bg-white ring-1 ring-line">
                      <Clock aria-hidden className="size-5 text-carla-600" />
                    </span>
                    <span>
                      <span className="block text-sm text-muted">Service client</span>
                      {contact.customerServiceHours}
                    </span>
                  </li>
                )}
              </ul>
            ) : (
              <p className="mt-6 text-muted">
                Nos coordonnées directes seront publiées prochainement. Vous pouvez également vous adresser à{" "}
                <Link href="/agences" className="text-ink-900 underline underline-offset-4">
                  nos agences
                </Link>
                .
              </p>
            )}
            <PreviewNotice className="mt-6">
              Renseignez téléphone, e-mail, adresse, horaires et WhatsApp dans <code>src/config/company.ts</code>. Le bouton
              WhatsApp n&apos;apparaît qu&apos;avec un numéro vérifié.
            </PreviewNotice>

            {socials.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-3">
                {socials.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center rounded-full bg-white px-4 text-sm ring-1 ring-line hover:ring-ink-900">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-12 grid gap-4">
              <Link href="/formation#inscription" className="group flex items-start gap-4 rounded-2xl bg-white p-5 ring-1 ring-line hover:ring-carla-600">
                <GraduationCap aria-hidden className="mt-0.5 size-6 text-carla-600" />
                <span>
                  <span className="block font-medium">Inscription à une formation</span>
                  <span className="text-sm text-muted">Demande d&apos;information pour les futurs conducteurs.</span>
                </span>
              </Link>
              <Link href="/contact?sujet=partenariat#formulaire" className="group flex items-start gap-4 rounded-2xl bg-white p-5 ring-1 ring-line hover:ring-carla-600">
                <Briefcase aria-hidden className="mt-0.5 size-6 text-carla-600" />
                <span>
                  <span className="block font-medium">Partenariat professionnel</span>
                  <span className="text-sm text-muted">Entreprises, organismes et collaborations.</span>
                </span>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div id="formulaire" className="scroll-mt-28 rounded-[2rem] bg-paper-2 p-6 ring-1 ring-line sm:p-10">
              <h2 className="display-md">Envoyer un message</h2>
              <div className="mt-8">
                <Suspense fallback={<InquiryForm deliveryConfigured={deliveryConfigured} />}>
                  <ContactFormWithTopic deliveryConfigured={deliveryConfigured} />
                </Suspense>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
