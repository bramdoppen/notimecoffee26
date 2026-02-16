import { sanityFetch } from "@/sanity/lib/fetch";
import { STORES_QUERY } from "@/sanity/lib/queries";
import { StoreLocator } from "@/components/map/store-locator";
import { StoreCard } from "@/components/ui/store-card";
import type { Metadata } from "next";

// TODO: Replace with generated types once @grind runs sanity typegen generate
type StoresQueryResult = any[];

export const metadata: Metadata = {
  title: "Our Locations",
  description:
    "Find No Time Coffee near you. Locations in Amsterdam, Arnhem & Den Haag.",
};

export default async function LocationsPage() {
  const stores = await sanityFetch<StoresQueryResult>({
    query: STORES_QUERY,
    tags: ["store"],
  });

  if (!stores || stores.length === 0) {
    return (
      <main>
        <section className="bg-crema-100 pt-(--space-16) pb-(--space-8)">
          <div className="container-site">
            <h1 className="font-display text-4xl lg:text-5xl text-espresso-600">
              Our Locations
            </h1>
            <p className="mt-(--space-2) text-lg text-stone">
              Amsterdam · Arnhem · Den Haag
            </p>
          </div>
        </section>
        <section className="py-(--space-16)">
          <div className="container-site text-center">
            <p className="text-4xl mb-(--space-4)">📍</p>
            <p className="text-lg text-stone">
              Store locations coming soon. Add stores in Sanity Studio.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      {/* Page header — compact, map is the hero */}
      <section className="bg-crema-100 pt-(--space-12) pb-(--space-6)">
        <div className="container-site">
          <h1 className="font-display text-4xl lg:text-5xl text-espresso-600">
            Find Your Coffee
          </h1>
          <p className="mt-(--space-2) text-lg text-stone">
            Three cities, one mission.
          </p>
        </div>
      </section>

      {/* Store locator — split view with map + cards */}
      <StoreLocator stores={stores} />

      {/* No-JS fallback — cards render without map or interactivity */}
      <noscript>
        <section className="py-(--space-8)">
          <div className="container-site">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-(--space-6)">
              {stores.map((store: any) => (
                <StoreCard key={store._id} store={store} variant="full" />
              ))}
            </div>
          </div>
        </section>
      </noscript>
    </main>
  );
}
