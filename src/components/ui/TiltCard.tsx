"use client";

import { m, useMotionValue, useSpring, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import type { PointerEvent, ReactNode } from "react";

/**
 * Subtle perspective tilt that follows a fine pointer (mouse/trackpad).
 * Inert on touch devices and for visitors who prefer reduced motion.
 */
export function TiltCard({ children, className, max = 5 }: { children: ReactNode; className?: string; max?: number }) {
  const reduce = usePrefersReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 140, damping: 18 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 140, damping: 18 });
  const glare = useTransform(
    px,
    (x) => `radial-gradient(600px circle at ${Math.round(x * 100)}% 0%, rgb(255 255 255 / 0.18), transparent 45%)`,
  );

  if (reduce) return <div className={className}>{children}</div>;

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div style={{ perspective: 1400 }} className={className}>
      <m.div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-full"
      >
        {children}
        <m.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-60 mix-blend-soft-light"
          style={{ background: glare }}
        />
      </m.div>
    </div>
  );
}
