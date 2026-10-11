import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export function LegalPage({ title, path, children }: { title: string; path: string; children: ReactNode }) {
  return (
    <>
      <div className="bg-ink-950 pt-32 pb-16 text-white sm:pt-40">
        <div className="container-page">
          <Breadcrumbs items={[{ name: title, path }]} />
          <h1 className="display-lg mt-8">{title}</h1>
        </div>
      </div>
      <article className="bg-paper py-16 sm:py-24">
        <div className="container-page max-w-3xl space-y-10 leading-relaxed text-muted [&_h2]:font-[family-name:var(--font-display)] [&_h2]:text-2xl [&_h2]:text-ink-900 [&_p]:mt-3 [&_strong]:text-ink-900">
          {children}
        </div>
      </article>
    </>
  );
}

/** Inline placeholder for a legal field not yet provided by the company. */
export function Missing({ label }: { label: string }) {
  return <span className="rounded bg-carla-50 px-1.5 py-0.5 text-sm font-medium text-carla-700">[{label} — à compléter]</span>;
}
