"use client";

import { cn } from "@/lib/utils";

type BlogCategoryFilterProps = {
  categories: string[];
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
};

/** Category display names — capitalize first letter */
function displayName(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ");
}

export function BlogCategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: BlogCategoryFilterProps) {
  return (
    <nav
      aria-label="Filter posts by category"
      role="tablist"
      className="flex gap-(--space-2) overflow-x-auto scrollbar-none pb-1"
    >
      {/* "All" is always first */}
      <button
        role="tab"
        aria-selected={activeCategory === null}
        onClick={() => onCategoryChange(null)}
        className={cn(
          "shrink-0 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-500",
          "min-h-[44px]",
          activeCategory === null
            ? "bg-forest-600 text-white shadow-sm"
            : "bg-crema-100 text-espresso-600 hover:bg-crema-200"
        )}
      >
        All
      </button>

      {categories.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            role="tab"
            aria-selected={isActive}
            onClick={() => onCategoryChange(category)}
            className={cn(
              "shrink-0 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-500",
              "min-h-[44px]",
              isActive
                ? "bg-forest-600 text-white shadow-sm"
                : "bg-crema-100 text-espresso-600 hover:bg-crema-200"
            )}
          >
            {displayName(category)}
          </button>
        );
      })}
    </nav>
  );
}
