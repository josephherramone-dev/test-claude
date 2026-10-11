import { ExternalLink, MessageSquareQuote, Star } from "lucide-react";
import { PreviewNotice } from "@/components/ui/PreviewNotice";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { company } from "@/config/company";
import { siteConfig } from "@/config/site";
import { getTestimonials } from "@/lib/content";
import { formatDate } from "@/lib/utils";

function Rating({ value }: { value: number }) {
  return (
    <p className="flex gap-0.5" aria-label={`Note : ${value} sur 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} aria-hidden className={i < value ? "size-4 fill-carla-500 text-carla-500" : "size-4 text-ink-300"} />
      ))}
    </p>
  );
}

/**
 * Editorial testimonials. Renders only authentic, verified reviews.
 * With none supplied: hidden in production, preview prompt in development.
 */
export function Testimonials() {
  const items = getTestimonials();
  if (items.length === 0 && !siteConfig.showPreviewContent) return null;

  const [featured, ...rest] = items;

  return (
    <section aria-labelledby="testimonials-title" className="bg-paper py-24 sm:py-32">
      <div className="container-page">
        <Reveal>
          <SectionHeading id="testimonials-title" eyebrow="Ils ont voyagé avec nous" title="La parole à nos voyageurs" />
        </Reveal>

        {items.length === 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="flex min-h-64 flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-line p-10 text-center text-muted">
              <MessageSquareQuote aria-hidden className="size-10 text-carla-500" />
              <p className="mt-4 font-[family-name:var(--font-display)] text-xl text-ink-900">Emplacement des avis clients</p>
              <p className="mt-2 max-w-md">Mise en page éditoriale prête à recevoir de vrais témoignages : citation, nom, note et source.</p>
            </div>
            <PreviewNotice>
              Aucun avis n&apos;est publié. Fournissez des témoignages authentiques (avec accord des auteurs) ou un lien vers une
              source publique vérifiable (Google, Facebook…) dans <code>src/data/testimonials.ts</code> et{" "}
              <code>company.reviewSource</code>. Cette section reste masquée en production tant qu&apos;elle est vide.
            </PreviewNotice>
          </div>
        ) : (
          <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
            {featured && (
              <Reveal>
                <figure className="relative h-full overflow-hidden rounded-[2rem] bg-ink-950 p-10 text-white sm:p-14">
                  <span aria-hidden className="absolute -top-6 left-8 font-[family-name:var(--font-display)] text-[10rem] leading-none text-carla-500/30">
                    “
                  </span>
                  <blockquote className="relative font-[family-name:var(--font-display)] text-2xl leading-snug font-light sm:text-3xl">
                    {featured.quote}
                  </blockquote>
                  <figcaption className="relative mt-10 flex flex-wrap items-center justify-between gap-4 text-sm text-ink-300">
                    <span>
                      <span className="block text-base text-white">{featured.name}</span>
                      {featured.source}
                      {featured.date ? ` · ${formatDate(featured.date)}` : ""}
                    </span>
                    {featured.rating ? <Rating value={featured.rating} /> : null}
                  </figcaption>
                </figure>
              </Reveal>
            )}
            <div className="grid gap-6">
              {rest.slice(0, 3).map((item, index) => (
                <Reveal key={`${item.name}-${index}`} delay={0.1 * (index + 1)}>
                  <figure className="h-full rounded-[1.5rem] bg-white p-8 ring-1 ring-line">
                    {item.rating ? <Rating value={item.rating} /> : null}
                    <blockquote className="mt-3 leading-relaxed text-ink-900">{item.quote}</blockquote>
                    <figcaption className="mt-5 text-sm text-muted">
                      <span className="font-medium text-ink-900">{item.name}</span> · {item.source}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {company.reviewSource && (
          <a
            href={company.reviewSource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2 font-medium text-carla-700 underline underline-offset-4"
          >
            Lire tous les avis sur {company.reviewSource.label} <ExternalLink aria-hidden className="size-4" />
          </a>
        )}
      </div>
    </section>
  );
}
