"use client";

import Image from "next/image";
import { useRef } from "react";
import { m, useScroll, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { ArrowRight, Clock3, ShieldCheck, Sofa, Ticket } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { images } from "@/config/images";
import { t } from "@/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

const trustItems = [
  { icon: ShieldCheck, title: t.trust.safety, text: t.trust.safetyText },
  { icon: Clock3, title: t.trust.punctuality, text: t.trust.punctualityText },
  { icon: Sofa, title: t.trust.comfort, text: t.trust.comfortText },
];

/**
 * Cinematic hero. Composition keeps all text away from the « C.ARLA » lettering
 * on the coach: on large screens the photograph is offset to the right behind a
 * dark gradient; on small screens the text sits below the image.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // MotionConfig (reducedMotion="user") drops the movement for visitors who prefer reduced motion.
  const appear = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, delay, ease },
  });

  return (
    <section ref={ref} aria-labelledby="hero-title" className="grain relative overflow-hidden bg-ink-950 text-white lg:min-h-[100svh]">
      {/* Photograph */}
      <div className="relative h-[58svh] min-h-[360px] overflow-hidden lg:absolute lg:inset-y-0 lg:right-0 lg:left-[22%] lg:h-auto 2xl:left-[28%]">
        <m.div className="absolute inset-0" style={reduce ? undefined : { y: imageY }}>
          <Image
            src={images.hero.src}
            alt={images.hero.alt}
            fill
            priority
            fetchPriority="high"
            sizes="(min-width: 1536px) 72vw, (min-width: 1024px) 78vw, 100vw"
            className="animate-ken-burns object-cover"
            style={{ objectPosition: images.hero.position }}
          />
        </m.div>
        {/* Overlays for legibility */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/10 to-ink-950/40 lg:hidden" />
        <div
          aria-hidden
          className="absolute inset-0 hidden lg:block"
          style={{
            background:
              "linear-gradient(90deg, var(--color-ink-950) 0%, rgb(8 8 11 / 0.82) 9%, rgb(8 8 11 / 0.25) 24%, transparent 40%), linear-gradient(0deg, var(--color-ink-950) 0%, rgb(8 8 11 / 0.35) 22%, transparent 42%), linear-gradient(180deg, rgb(8 8 11 / 0.55) 0%, transparent 18%)",
          }}
        />
      </div>

      {/* Copy */}
      <div className="container-page relative z-10 lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center">
        <m.div
          style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
          className="-mt-20 max-w-xl pb-10 lg:mt-0 lg:max-w-[33rem] lg:pt-28 lg:pb-48 xl:max-w-[35rem]"
        >
          <m.p {...appear(0.1)} className="eyebrow flex items-center gap-3 text-carla-300">
            <span aria-hidden className="h-px w-10 bg-carla-300/70" />
            {t.brand.identifier}
          </m.p>
          <m.h1 {...appear(0.25)} id="hero-title" className="display-xl mt-6">
            Votre voyage commence <em className="font-light text-sand-300 not-italic">en toute confiance.</em>
          </m.h1>
          <m.p {...appear(0.45)} className="mt-7 max-w-lg text-lg leading-relaxed text-ink-200">
            Des trajets en autocar entre les villes du Maroc, pensés pour votre sécurité et votre confort, avec des
            équipes qui prennent votre temps au sérieux.
          </m.p>
          <m.div {...appear(0.6)} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink
              href="/reservation"
              size="lg"
              event="booking_cta_click"
              eventProps={{ location: "hero" }}
              icon={<Ticket aria-hidden className="size-5" />}
            >
              {t.cta.bookMine}
            </ButtonLink>
            <ButtonLink
              href="/trajets"
              size="lg"
              variant="outline-light"
              icon={<ArrowRight aria-hidden className="flip-rtl size-5 transition-transform group-hover:translate-x-1" />}
            >
              {t.cta.discoverRoutes}
            </ButtonLink>
          </m.div>
        </m.div>
      </div>

      {/* Trust strip */}
      <div className="relative z-10 lg:absolute lg:inset-x-0 lg:bottom-0">
        <div className="container-page pb-12 lg:pb-10">
          <m.ul
            {...appear(0.85)}
            aria-label="Nos engagements"
            className="glass-dark grid divide-y divide-white/10 rounded-3xl sm:grid-cols-3 sm:divide-x sm:divide-y-0 rtl:sm:divide-x-reverse"
          >
            {trustItems.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-4 p-5 lg:p-6">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-carla-500/15 text-carla-300 ring-1 ring-carla-300/30">
                  <Icon aria-hidden className="size-5" />
                </span>
                <span>
                  <span className="block font-[family-name:var(--font-display)] text-lg">{title}</span>
                  <span className="mt-0.5 block text-sm leading-snug text-ink-300">{text}</span>
                </span>
              </li>
            ))}
          </m.ul>
        </div>
      </div>

      {/* Scroll cue */}
      <div aria-hidden className="absolute top-1/2 right-6 z-10 hidden -translate-y-1/2 flex-col items-center gap-3 xl:flex">
        <span className="eyebrow text-[0.65rem] text-white/60 [writing-mode:vertical-rl]">{t.common.scroll}</span>
        <span className="relative h-16 w-px overflow-hidden bg-white/15">
          <span className="animate-scroll-cue absolute inset-x-0 top-0 h-1/2 bg-carla-300" />
        </span>
      </div>
    </section>
  );
}
