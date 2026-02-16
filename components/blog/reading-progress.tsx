"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Reading progress bar — 3px forest-500, fixed top of viewport.
 * Tracks scroll progress through the article body.
 * Respects prefers-reduced-motion.
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number>(0);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    // Check reduced motion preference
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const article = document.querySelector("article");
    if (!article) return;

    function updateProgress() {
      if (!article) return;

      const rect = article.getBoundingClientRect();
      const articleTop = rect.top + window.scrollY;
      const articleHeight = rect.height;
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // Progress: how far through the article we've scrolled
      const start = articleTop;
      const end = articleTop + articleHeight - viewportHeight;
      const current = scrollY;

      if (current < start) {
        setProgress(0);
        setVisible(false);
      } else if (current > end) {
        setProgress(100);
        setVisible(false); // Disappear past article body
      } else {
        const pct = ((current - start) / (end - start)) * 100;
        setProgress(Math.min(100, Math.max(0, pct)));
        setVisible(true);
      }
    }

    function onScroll() {
      if (prefersReducedMotion.current) {
        // Skip animation, just update directly
        updateProgress();
        return;
      }
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateProgress);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    // Initial check
    updateProgress();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-crema-100/30"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <div
        className="h-full bg-forest-500"
        style={{
          width: `${progress}%`,
          transition: prefersReducedMotion.current
            ? "none"
            : "width 100ms linear",
        }}
      />
    </div>
  );
}
