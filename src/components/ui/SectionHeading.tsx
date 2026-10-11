import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: "light" | "dark";
  align?: "start" | "center";
  as?: "h1" | "h2";
  className?: string;
  id?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  tone = "light",
  align = "start",
  as: Heading = "h2",
  className,
  id,
}: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className={cn("eyebrow mb-5 flex items-center gap-3", dark ? "text-carla-300" : "text-carla-700", align === "center" && "justify-center")}>
          <span aria-hidden className={cn("h-px w-8", dark ? "bg-carla-300/70" : "bg-carla-700/60")} />
          {eyebrow}
        </p>
      )}
      <Heading id={id} className={cn("display-lg", dark ? "text-white" : "text-ink-900")}>
        {title}
      </Heading>
      {lead && (
        <p className={cn("mt-6 text-lg leading-relaxed", dark ? "text-ink-300" : "text-muted")}>{lead}</p>
      )}
    </div>
  );
}
