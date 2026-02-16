"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

type Testimonial = {
  quote: string;
  author: string;
  role?: string;
};

type TestimonialSectionProps = {
  heading?: string;
  testimonials: Testimonial[];
};

function TestimonialSection({
  heading = "What People Say",
  testimonials,
}: TestimonialSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % testimonials.length);
  }, [testimonials.length]);

  const goTo = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // Auto-advance every 6s, pause on hover/focus
  useEffect(() => {
    if (isPaused || testimonials.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [isPaused, next, testimonials.length]);

  if (!testimonials || testimonials.length === 0) return null;

  const current = testimonials[activeIndex];

  return (
    <section
      className="py-(--space-12) lg:py-(--space-16) bg-crema-100"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="container-site max-w-[720px] mx-auto text-center">
        {heading && (
          <h2 className="font-display text-3xl lg:text-4xl text-espresso-600 mb-(--space-8)">
            {heading}
          </h2>
        )}
        <div className="relative" aria-live="polite" aria-atomic="true">
          {/* Decorative quote mark */}
          <span
            className="block font-display text-7xl text-sage-300 leading-none select-none mb-(--space-2)"
            aria-hidden="true"
          >
            "
          </span>
          <blockquote>
            <p className="font-display text-2xl lg:text-3xl text-espresso-600 italic leading-relaxed">
              {current.quote}
            </p>
            <footer className="mt-(--space-4) text-base text-stone">
              — {current.author}
              {current.role && (
                <span className="text-pebble"> · {current.role}</span>
              )}
            </footer>
          </blockquote>
        </div>

        {/* Dot navigation */}
        {testimonials.length > 1 && (
          <div
            className="flex justify-center gap-(--space-2) mt-(--space-6)"
            role="tablist"
            aria-label="Testimonial navigation"
          >
            {testimonials.map((_, index) => (
              <button
                key={index}
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`Testimonial ${index + 1} of ${testimonials.length}`}
                onClick={() => goTo(index)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") {
                    goTo((index + 1) % testimonials.length);
                  } else if (e.key === "ArrowLeft") {
                    goTo((index - 1 + testimonials.length) % testimonials.length);
                  }
                }}
                tabIndex={index === activeIndex ? 0 : -1}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-(--transition-base)",
                  index === activeIndex
                    ? "bg-forest-600 scale-125"
                    : "bg-pebble hover:bg-stone"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export { TestimonialSection, type TestimonialSectionProps };
