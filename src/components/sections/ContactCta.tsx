import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { images } from "@/config/images";
import { t } from "@/i18n";

export function ContactCta({
  title = "Une question avant de partir ?",
  text = "Trajets, billets, agences, formation ou partenariat : notre équipe est là pour vous orienter.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section aria-labelledby="cta-title" className="bg-paper px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="grain relative overflow-hidden rounded-[2rem] bg-ink-950 text-white sm:rounded-[2.5rem]">
        <Image
          src={images.landscape.src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-50"
          style={{ objectPosition: "20% 45%" }}
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/80 to-ink-950/20 rtl:bg-gradient-to-l" />
        <div className="container-page relative z-[2] py-24 sm:py-32">
          <Reveal className="max-w-2xl">
            <p className="font-[family-name:var(--font-script)] text-4xl text-carla-300">Travel in style</p>
            <h2 id="cta-title" className="display-lg mt-4">
              {title}
            </h2>
            <p className="mt-6 text-lg text-ink-200">{text}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/contact" size="lg" variant="light">
                {t.cta.contact}
              </ButtonLink>
              <ButtonLink href="/reservation" size="lg" variant="outline-light" event="booking_cta_click" eventProps={{ location: "cta_band" }}>
                {t.cta.book}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
