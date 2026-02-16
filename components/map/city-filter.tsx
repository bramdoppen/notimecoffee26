"use client";

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CityOption = {
  value: string | null; // null = "All"
  label: string;
  count: number;
};

type CityFilterProps = {
  cities: CityOption[];
  activeCity: string | null;
  onCityChange: (city: string | null) => void;
};

// ---------------------------------------------------------------------------
// CityFilter — pill tabs matching menu category nav style
// ---------------------------------------------------------------------------

export function CityFilter({
  cities,
  activeCity,
  onCityChange,
}: CityFilterProps) {
  return (
    <nav aria-label="Filter stores by city" role="tablist" className="flex flex-wrap gap-(--space-2)">
      {cities.map((city) => {
        const isActive = activeCity === city.value;
        return (
          <button
            key={city.value ?? "all"}
            role="tab"
            aria-selected={isActive}
            onClick={() => onCityChange(city.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-500",
              "min-h-[44px]", // 44px touch target
              isActive
                ? "bg-forest-600 text-white shadow-sm"
                : "bg-white text-espresso-500 border border-mist hover:bg-crema-50 hover:border-forest-200"
            )}
          >
            {city.label}
            <span
              className={cn(
                "text-xs rounded-full px-1.5 py-0.5",
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-crema-100 text-stone"
              )}
            >
              {city.count}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
