import Image from "next/image";
import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { PreviewNotice } from "@/components/ui/PreviewNotice";
import { Reveal } from "@/components/ui/Reveal";
import { company } from "@/config/company";
import { images } from "@/config/images";
import type { Pillar } from "@/data/pillars";
import { cn } from "@/lib/utils";

/** Full editorial section for one pillar. Alternates dark / light and image side. */
export function PillarSection({
  pillar,
  tone,
  reverse = false,
  children,
}: {
  pillar: Pillar;
  tone: "dark" | "light";
  reverse?: boolean;
  /** Extra content (e.g. route information block for the « Temps » pillar). */
  children?: ReactNode;
}) {
  const dark = tone === "dark";
  const image = images[pillar.image];
  const practices = company.verifiedPractices[pillar.practicesKey];

  return (
    <section
      id={pillar.id}
      aria-labelledby={`${pillar.id}-title`}
      className={cn("relative scroll-mt-20 overflow-hidden py-24 sm:py-32", dark ? "grain bg-ink-950 text-white" : "bg-paper text-ink-900")}
    >
      <div className="container-page relative z-[2]">
        <div className={cn("grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20", reverse && "lg:[&>*:first-child]:order-2")}>
          <Reveal>
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] sm:aspect-[5/4] lg:aspect-[4/5]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover transition-transform duration-[2s] ease-[var(--ease-cinematic)] hover:scale-105"
                  style={{ objectPosition: image.position }}
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent" />
              </div>
              <span
                aria-hidden
                className={cn(
                  "absolute -bottom-8 font-[family-name:var(--font-display)] text-[7rem] leading-none font-extralight sm:text-[9rem]",
                  reverse ? "-left-2 lg:-left-6 rtl:-right-2 rtl:left-auto" : "-right-2 lg:-right-6 rtl:-left-2 rtl:right-auto",
                  dark ? "text-white/10" : "text-ink-900/10",
                )}
              >
                {pillar.number}
              </span>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className={cn("eyebrow flex items-center gap-3", dark ? "text-carla-300" : "text-carla-700")}>
                <span aria-hidden className={cn("h-px w-8", dark ? "bg-carla-300/70" : "bg-carla-700/60")} />
                {pillar.number} · {pillar.eyebrow}
              </p>
              <h2 id={`${pillar.id}-title`} className="display-lg mt-6">
                {pillar.headline}
              </h2>
              <p className={cn("mt-6 text-lg leading-relaxed", dark ? "text-ink-300" : "text-muted")}>{pillar.lead}</p>
            </Reveal>

            <ul className="mt-10 space-y-6">
              {pillar.values.map((value, index) => (
                <Reveal as="li" key={value.title} delay={0.08 * index} className={cn("border-t pt-6", dark ? "border-white/10" : "border-line")}>
                  <h3 className="font-[family-name:var(--font-display)] text-xl">{value.title}</h3>
                  <p className={cn("mt-1.5 leading-relaxed", dark ? "text-ink-300" : "text-muted")}>{value.text}</p>
                </Reveal>
              ))}
            </ul>

            {practices.length > 0 ? (
              <div className={cn("mt-10 rounded-2xl p-6", dark ? "bg-white/5 ring-1 ring-white/10" : "bg-white ring-1 ring-line")}>
                <h3 className="eyebrow">Nos pratiques</h3>
                <ul className="mt-4 space-y-2.5">
                  {practices.map((practice) => (
                    <li key={practice} className="flex gap-3">
                      <Check aria-hidden className="mt-0.5 size-5 shrink-0 text-carla-500" />
                      {practice}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <PreviewNotice tone={tone} className="mt-10">
                Ajoutez dans <code>company.verifiedPractices.{pillar.practicesKey}</code> les pratiques concrètes et vérifiées
                (ex. contrôles, équipements, procédures). Rien n&apos;est affiché tant que la liste est vide.
              </PreviewNotice>
            )}

            {children}

            <div className="mt-10">
              <ButtonLink href={pillar.cta.href} variant={dark ? "outline-light" : "outline-dark"}>
                {pillar.cta.label}
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
