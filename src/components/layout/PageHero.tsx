import Image from "next/image";
import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/seo/Breadcrumbs";
import { images, type ImageKey } from "@/config/images";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  breadcrumbs: Crumb[];
  image?: ImageKey;
  children?: ReactNode;
}

/** Dark cinematic header band used by inner pages. */
export function PageHero({ eyebrow, title, lead, breadcrumbs, image = "landscape", children }: PageHeroProps) {
  const slot = images[image];
  return (
    <section className="grain relative overflow-hidden bg-ink-950 pt-36 pb-20 text-white sm:pt-44 sm:pb-28">
      <div aria-hidden className="absolute inset-0">
        <Image
          src={slot.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-45"
          style={{ objectPosition: slot.position }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/40 rtl:bg-gradient-to-l" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/60" />
      </div>
      <div className="container-page relative z-[2]">
        <Breadcrumbs items={breadcrumbs} />
        <p className="eyebrow mt-10 flex items-center gap-3 text-carla-300">
          <span aria-hidden className="h-px w-10 bg-carla-300/70" />
          {eyebrow}
        </p>
        <h1 className="display-xl mt-6 max-w-4xl">{title}</h1>
        {lead && <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-200">{lead}</p>}
        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  );
}
