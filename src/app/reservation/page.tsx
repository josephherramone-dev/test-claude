import { BookingSection } from "@/components/booking/BookingSection";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqEntries } from "@/data/faq";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Réserver un billet d'autocar en ligne",
  description:
    "Réservez votre billet d'autocar Carla Tamassint Transport en ligne via Markoub.ma, notre plateforme de réservation partenaire. Paiement sécurisé sur la plateforme.",
  path: "/reservation",
});

export default function ReservationPage() {
  const related = faqEntries.filter((f) => ["reserver", "acheter", "modifier", "bagages"].includes(f.id));
  return (
    <>
      <div className="bg-ink-900 pt-28 sm:pt-32">
        <div className="container-page">
          <Breadcrumbs items={[{ name: "Réservation", path: "/reservation" }]} />
        </div>
      </div>
      <BookingSection headingLevel="h1" />
      <section aria-labelledby="booking-faq" className="bg-paper py-20 sm:py-28">
        <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.5fr]">
          <SectionHeading id="booking-faq" eyebrow="Avant de réserver" title="Vos questions sur les billets" />
          <FaqAccordion entries={related} />
        </div>
      </section>
    </>
  );
}
