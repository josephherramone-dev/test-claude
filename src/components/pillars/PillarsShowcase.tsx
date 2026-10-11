"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { images } from "@/config/images";
import type { Pillar } from "@/data/pillars";
import { cn } from "@/lib/utils";

/**
 * Home-page overview of the four pillars. On large screens: an expanding
 * horizontal gallery (hover, focus or click to open a panel). On small screens:
 * stacked editorial cards.
 */
export function PillarsShowcase({ pillars }: { pillars: Pillar[] }) {
  const [active, setActive] = useState(0);

  return (
    <>
      {/* Desktop gallery */}
      <div className="hidden h-[34rem] gap-3 lg:flex" role="list">
        {pillars.map((pillar, index) => {
          const isActive = index === active;
          const image = images[pillar.image];
          const panelId = `pillar-panel-${pillar.id}`;
          return (
            <div
              key={pillar.id}
              role="listitem"
              onMouseEnter={() => setActive(index)}
              className={cn(
                "group relative overflow-hidden rounded-[1.75rem] bg-ink-900 transition-[flex-grow] duration-700 ease-[var(--ease-cinematic)]",
                isActive ? "grow-[3.2]" : "grow",
              )}
              style={{ flexBasis: 0 }}
            >
              <Image
                src={image.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className={cn(
                  "object-cover transition-[transform,filter] duration-[1.2s] ease-[var(--ease-cinematic)]",
                  isActive ? "scale-105 brightness-[0.7]" : "scale-125 brightness-[0.4] saturate-50",
                )}
                style={{ objectPosition: image.position }}
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />

              <button
                type="button"
                onClick={() => setActive(index)}
                onFocus={() => setActive(index)}
                aria-expanded={isActive}
                aria-controls={panelId}
                className="absolute inset-0 z-10 cursor-pointer rounded-[1.75rem] text-start"
              >
                <span className="sr-only">
                  {pillar.title} — {pillar.eyebrow}
                </span>
              </button>

              <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-7 text-white">
                <div className="flex items-start justify-between">
                  <span className="font-[family-name:var(--font-display)] text-sm tracking-[0.3em] text-carla-300">{pillar.number}</span>
                  <span className="eyebrow text-[0.65rem] text-white/60">{pillar.englishLabel}</span>
                </div>
                <div>
                  <h3
                    className={cn(
                      "font-[family-name:var(--font-display)] font-light transition-all duration-700",
                      isActive ? "text-4xl" : "text-2xl",
                    )}
                  >
                    {pillar.title}
                  </h3>
                  <div
                    id={panelId}
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-700 ease-[var(--ease-cinematic)]",
                      isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="mt-4 max-w-md font-[family-name:var(--font-display)] text-xl leading-snug text-sand-300">
                        {pillar.headline}
                      </p>
                      <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-200">{pillar.lead}</p>
                      <Link
                        href={`/services#${pillar.id}`}
                        tabIndex={isActive ? 0 : -1}
                        className="pointer-events-auto relative z-30 mt-6 inline-flex items-center gap-2 text-sm font-medium text-white underline-offset-4 hover:underline"
                      >
                        En savoir plus <ArrowRight aria-hidden className="flip-rtl size-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile cards */}
      <ul className="grid gap-4 sm:grid-cols-2 lg:hidden">
        {pillars.map((pillar) => {
          const image = images[pillar.image];
          return (
            <li key={pillar.id} className="relative overflow-hidden rounded-[1.5rem] bg-ink-900 text-white">
              <div className="relative h-44">
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover brightness-75"
                  style={{ objectPosition: image.position }}
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-900 to-transparent" />
                <span className="absolute top-5 left-5 font-[family-name:var(--font-display)] text-sm tracking-[0.3em] text-carla-300 rtl:right-5 rtl:left-auto">
                  {pillar.number}
                </span>
              </div>
              <div className="p-6 pt-2">
                <h3 className="font-[family-name:var(--font-display)] text-2xl font-light">{pillar.title}</h3>
                <p className="mt-2 font-[family-name:var(--font-display)] text-lg leading-snug text-sand-300">{pillar.headline}</p>
                <Link
                  href={`/services#${pillar.id}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium after:absolute after:inset-0"
                >
                  En savoir plus <ArrowRight aria-hidden className="flip-rtl size-4" />
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
