import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { ContactCta } from "@/components/sections/ContactCta";
import { faqEntries } from "@/data/faq";
import { faqPageJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Questions fréquentes — Billets, horaires, agences",
  description:
    "Réponses aux questions fréquentes des voyageurs Carla Tamassint Transport : réservation, achat de billets, horaires, agences, retards, bagages et formation.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Questions fréquentes"
        title="Toutes les réponses pour bien préparer votre voyage."
        breadcrumbs={[{ name: "Questions fréquentes", path: "/faq" }]}
        image="time"
      />
      <section aria-label="Questions et réponses" className="bg-paper py-20 sm:py-28">
        <div className="container-page max-w-4xl">
          <FaqAccordion entries={faqEntries} defaultOpen="reserver" />
          <p className="mt-10 text-muted">
            Ces réponses sont fournies à titre informatif. Pour toute situation particulière, notre service client reste votre
            meilleur interlocuteur.
          </p>
        </div>
      </section>
      <ContactCta title="Vous n'avez pas trouvé votre réponse ?" />
      <JsonLd data={faqPageJsonLd(faqEntries)} />
    </>
  );
}
