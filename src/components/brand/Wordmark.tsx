import { cn } from "@/lib/utils";

/**
 * Text reconstruction of the « C.ARLA » wordmark painted on the coaches.
 * Replace with the official logo file when supplied (see README › Logo).
 */
export function Wordmark({
  className,
  withSignature = false,
  tone = "light",
}: {
  className?: string;
  withSignature?: boolean;
  tone?: "light" | "dark";
}) {
  return (
    <span className={cn("inline-flex flex-col leading-none", tone === "light" ? "text-white" : "text-ink-900", className)}>
      <span className="wordmark text-[1.35em]">
        <span className="tracking-[0.06em]">C</span>
        <span aria-hidden className="me-[0.3em] inline-block size-[0.16em] rounded-full bg-carla-400 align-baseline" />
        ARLA
      </span>
      {withSignature && (
        <span aria-hidden className="mt-1 self-end font-[family-name:var(--font-script)] text-[0.95em] tracking-normal opacity-80">
          Travel in style
        </span>
      )}
      <span className="sr-only"> Tamassint Transport</span>
    </span>
  );
}
