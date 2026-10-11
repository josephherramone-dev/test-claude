import { Construction } from "lucide-react";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Editorial note for the company, shown ONLY in development / staging preview.
 * Explains which verified information is missing. Never rendered in production.
 */
export function PreviewNotice({
  children,
  tone = "light",
  className,
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  if (!siteConfig.showPreviewContent) return null;
  return (
    <div
      role="note"
      className={cn(
        "flex gap-3 rounded-2xl border border-dashed p-4 text-sm leading-relaxed",
        tone === "dark" ? "border-carla-300/40 bg-carla-500/10 text-carla-50" : "border-carla-700/40 bg-carla-50 text-carla-700",
        className,
      )}
    >
      <Construction aria-hidden className="mt-0.5 size-4 shrink-0" />
      <div>
        <strong className="font-semibold">Aperçu interne — information à fournir. </strong>
        {children}
      </div>
    </div>
  );
}

export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-dashed border-carla-500 bg-carla-50 px-2.5 py-0.5 text-[0.7rem] font-semibold tracking-wider text-carla-700 uppercase",
        className,
      )}
    >
      Démonstration
    </span>
  );
}
