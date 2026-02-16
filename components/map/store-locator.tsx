"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { StoreCard } from "@/components/ui/store-card";
import { CityFilter, type CityOption } from "./city-filter";
import type { MapStore } from "./store-map";

// ---------------------------------------------------------------------------
// Dynamic import — Leaflet requires browser APIs, no SSR
// ---------------------------------------------------------------------------

const StoreMap = dynamic(() => import("./store-map"), {
  ssr: false,
  loading: () => (
    <div
      className="h-full w-full bg-sage-100 animate-pulse flex items-center justify-center"
      role="status"
      aria-label="Loading map"
    >
      <span className="text-stone text-sm">Loading map…</span>
    </div>
  ),
});

// ---------------------------------------------------------------------------
// City display names — store.city values are lowercase
// ---------------------------------------------------------------------------

const CITY_DISPLAY: Record<string, string> = {
  amsterdam: "Amsterdam",
  arnhem: "Arnhem",
  "den-haag": "Den Haag",
};

function cityDisplayName(city: string): string {
  return CITY_DISPLAY[city] ?? city.charAt(0).toUpperCase() + city.slice(1);
}

// ---------------------------------------------------------------------------
// StoreLocator — orchestrates map, cards, and city filter
// ---------------------------------------------------------------------------

type StoreLocatorProps = {
  stores: MapStore[];
};

export function StoreLocator({ stores }: StoreLocatorProps) {
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // ---- City filter options ----
  const cityOptions = useMemo<CityOption[]>(() => {
    const cityCounts: Record<string, number> = {};
    for (const store of stores) {
      const city = store.city || "other";
      cityCounts[city] = (cityCounts[city] || 0) + 1;
    }

    const options: CityOption[] = [
      { value: null, label: "All", count: stores.length },
    ];

    // Sort cities alphabetically
    const sortedCities = Object.keys(cityCounts).sort();
    for (const city of sortedCities) {
      options.push({
        value: city,
        label: cityDisplayName(city),
        count: cityCounts[city],
      });
    }

    return options;
  }, [stores]);

  // ---- Filtered stores ----
  const filteredStores = useMemo(() => {
    if (!activeCity) return stores;
    return stores.filter((s) => s.city === activeCity);
  }, [stores, activeCity]);

  // ---- Two-way binding: marker click → scroll card into view ----
  const handleMarkerClick = useCallback((storeId: string) => {
    setSelectedStoreId(storeId);
    const cardEl = cardRefs.current[storeId];
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, []);

  // ---- Two-way binding: card click → flyTo marker ----
  const handleCardClick = useCallback((storeId: string) => {
    setSelectedStoreId(storeId);
    // flyTo is handled by MapController inside StoreMap
  }, []);

  // ---- City filter change ----
  const handleCityChange = useCallback((city: string | null) => {
    setActiveCity(city);
    setSelectedStoreId(null); // Clear selection when changing city
  }, []);

  // ---- Card ref setter ----
  const setCardRef = useCallback(
    (storeId: string) => (el: HTMLDivElement | null) => {
      cardRefs.current[storeId] = el;
    },
    []
  );

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[380px_1fr] lg:h-[calc(100vh-var(--header-height,64px))]">
      {/* Skip link for keyboard/screen reader users — map can be a keyboard trap */}
      <a
        href="#store-list"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:bg-forest-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:text-sm"
      >
        Skip to store list
      </a>

      {/* ---- Left panel: filter + cards ---- */}
      <div className="flex flex-col lg:h-full">
        {/* City filter */}
        <div className="p-(--space-4) border-b border-mist bg-white sticky top-0 z-10">
          <CityFilter
            cities={cityOptions}
            activeCity={activeCity}
            onCityChange={handleCityChange}
          />
        </div>

        {/* Store cards — scrollable on desktop */}
        <div
          id="store-list"
          className="flex-1 overflow-y-auto p-(--space-4) space-y-(--space-4) lg:shadow-[2px_0_8px_rgba(44,80,22,0.08)]"
        >
          {filteredStores.length === 0 ? (
            <div className="text-center py-(--space-8)">
              <p className="text-4xl mb-(--space-2)">📍</p>
              <p className="text-stone">No stores found in this area.</p>
            </div>
          ) : (
            filteredStores.map((store) => (
              <div
                key={store._id}
                ref={setCardRef(store._id)}
                onClick={() => handleCardClick(store._id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCardClick(store._id);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Select ${store.name} in ${cityDisplayName(store.city)}`}
                className={`cursor-pointer rounded-lg transition-all ${
                  selectedStoreId === store._id
                    ? "ring-2 ring-forest-500 bg-forest-50 border-l-2 border-l-forest-500"
                    : "hover:shadow-md"
                }`}
              >
                {/* Cast: MapStore is a superset of StoreCard's store type.
                    Both come from STORES_QUERY — types unify after typegen. */}
                <StoreCard store={store as any} variant="full" />
              </div>
            ))
          )}
        </div>
      </div>

      {/* ---- Right panel: map ---- */}
      {/* Mobile: 50vh above cards. Desktop: fills remaining space */}
      <div
        className="h-[50vh] lg:h-full order-first lg:order-last"
        role="application"
        aria-label="Store locations map — use skip link to bypass"
        tabIndex={-1}
      >
        <StoreMap
          stores={filteredStores}
          selectedStoreId={selectedStoreId}
          onMarkerClick={handleMarkerClick}
        />
      </div>
    </div>
  );
}
