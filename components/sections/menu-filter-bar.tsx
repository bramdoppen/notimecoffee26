"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { PRODUCT_CATEGORIES_QUERYResult } from "@/sanity/types";

type Category = PRODUCT_CATEGORIES_QUERYResult[number];

type MenuFilterBarProps = {
  categories: Category[];
  dietaryFlags: string[];
  totalItems: number;
  filteredCount: number;
};

const DIETARY_ICONS: Record<string, string> = {
  vegan: "🌱",
  vegetarian: "🥬",
  "gluten-free": "🚫",
  decaf: "☕",
};

type ViewMode = "grid" | "list";

function MenuFilterBar({
  categories,
  dietaryFlags,
  totalItems,
  filteredCount,
}: MenuFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") || "all";
  const activeDietary = searchParams.getAll("dietary");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Read localStorage preference on mount — no flash
  useEffect(() => {
    const stored = localStorage.getItem("ntc-menu-view") as ViewMode | null;
    if (stored === "grid" || stored === "list") {
      setViewMode(stored);
    }
  }, []);

  const updateViewMode = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem("ntc-menu-view", mode);
  }, []);

  function buildUrl(params: Record<string, string | string[] | null>) {
    const sp = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(params)) {
      sp.delete(key);
      if (value === null) continue;
      if (Array.isArray(value)) {
        value.forEach((v) => sp.append(key, v));
      } else {
        sp.set(key, value);
      }
    }
    const qs = sp.toString();
    return `/menu${qs ? `?${qs}` : ""}`;
  }

  function toggleDietary(flag: string) {
    const next = activeDietary.includes(flag)
      ? activeDietary.filter((f) => f !== flag)
      : [...activeDietary, flag];
    router.push(buildUrl({ dietary: next.length > 0 ? next : null }), { scroll: false });
  }

  function setCategory(slug: string) {
    router.push(
      buildUrl({ category: slug === "all" ? null : slug }),
      { scroll: false }
    );
  }

  const hasFilters = activeCategory !== "all" || activeDietary.length > 0;

  return (
    <div className="sticky top-[var(--header-height)] z-20 bg-white/95 backdrop-blur-sm border-b border-mist">
      <div className="container-site py-(--space-3)">
        {/* Category pills */}
        <nav
          className="flex gap-(--space-2) overflow-x-auto pb-(--space-2) scrollbar-none"
          role="tablist"
          aria-label="Menu categories"
        >
          <button
            role="tab"
            aria-selected={activeCategory === "all"}
            onClick={() => setCategory("all")}
            className={cn(
              "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-(--transition-fast)",
              activeCategory === "all"
                ? "bg-forest-600 text-white"
                : "text-espresso-500 hover:bg-sage-100"
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              role="tab"
              aria-selected={activeCategory === cat.slug.current}
              onClick={() => setCategory(cat.slug.current)}
              className={cn(
                "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-(--transition-fast)",
                activeCategory === cat.slug.current
                  ? "bg-forest-600 text-white"
                  : "text-espresso-500 hover:bg-sage-100"
              )}
            >
              {cat.icon && <span className="mr-1">{cat.icon}</span>}
              {cat.name}
            </button>
          ))}
        </nav>

        {/* Dietary filters + view toggle */}
        <div className="flex items-center justify-between gap-(--space-4) mt-(--space-2)">
          <div className="flex items-center gap-(--space-2) flex-wrap">
            {dietaryFlags.map((flag) => (
              <button
                key={flag}
                role="checkbox"
                aria-checked={activeDietary.includes(flag)}
                onClick={() => toggleDietary(flag)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-(--transition-fast)",
                  activeDietary.includes(flag)
                    ? "bg-forest-600 text-white"
                    : "bg-sage-100 text-sage-600 hover:bg-sage-200"
                )}
              >
                {DIETARY_ICONS[flag] || ""} {flag}
              </button>
            ))}
            {hasFilters && (
              <>
                <span className="text-xs text-stone ml-(--space-2)">
                  Showing {filteredCount} of {totalItems}
                </span>
                <button
                  onClick={() => router.push("/menu", { scroll: false })}
                  className="text-xs text-forest-600 underline hover:text-forest-500 ml-(--space-1)"
                >
                  Clear filters
                </button>
              </>
            )}
          </div>

          {/* View toggle */}
          <div
            className="hidden sm:flex items-center gap-1 shrink-0"
            role="radiogroup"
            aria-label="View mode"
          >
            <button
              role="radio"
              aria-checked={viewMode === "grid"}
              onClick={() => updateViewMode("grid")}
              className={cn(
                "p-1.5 rounded-(--radius-sm) transition-colors",
                viewMode === "grid" ? "text-forest-600" : "text-stone hover:text-espresso-600"
              )}
              aria-label="Grid view"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <rect x="1" y="1" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="10" y="1" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="1" y="10" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="10" y="10" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
            <button
              role="radio"
              aria-checked={viewMode === "list"}
              onClick={() => updateViewMode("list")}
              className={cn(
                "p-1.5 rounded-(--radius-sm) transition-colors",
                viewMode === "list" ? "text-forest-600" : "text-stone hover:text-espresso-600"
              )}
              aria-label="List view"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <rect x="1" y="1" width="16" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="1" y="7" width="16" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="1" y="13" width="16" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { MenuFilterBar, type MenuFilterBarProps, type ViewMode };
