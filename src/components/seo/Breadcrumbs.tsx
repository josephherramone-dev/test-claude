import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { breadcrumbJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { JsonLd } from "./JsonLd";

export interface Crumb {
  name: string;
  path: string;
}

export function Breadcrumbs({ items, tone = "dark", className }: { items: Crumb[]; tone?: "dark" | "light"; className?: string }) {
  const all = [{ name: "Accueil", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Fil d'Ariane" className={cn("text-sm", className)}>
        <ol className="flex flex-wrap items-center gap-1.5">
          {all.map((crumb, index) => {
            const last = index === all.length - 1;
            return (
              <li key={crumb.path} className="flex items-center gap-1.5">
                {last ? (
                  <span aria-current="page" className={tone === "dark" ? "text-white" : "text-ink-900"}>
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={crumb.path}
                    className={cn(
                      "underline-offset-4 hover:underline",
                      tone === "dark" ? "text-ink-300 hover:text-white" : "text-muted hover:text-ink-900",
                    )}
                  >
                    {crumb.name}
                  </Link>
                )}
                {!last && <ChevronRight aria-hidden className={cn("flip-rtl size-3.5", tone === "dark" ? "text-ink-400" : "text-ink-400")} />}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(all)} />
    </>
  );
}
