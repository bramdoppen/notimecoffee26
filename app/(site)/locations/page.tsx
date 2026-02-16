import { sanityFetch } from "@/sanity/lib/fetch";
import { STORES_QUERY } from "@/sanity/lib/queries";
import { StoreCard } from "@/components/ui/store-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Locations",
  description:
    "Find No Time Coffee near you. Locations in Amsterdam, Arnhem & Den Haag.",
};

export default async function LocationsPage() {
  const stores = await sanityFetch<any[]>({
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

  // Group stores by city
  const storesByCity = stores.reduce<Record<string, typeof stores>>(
    (acc, store) => {
      const city = store.city || "Other";
      if (!acc[city]) acc[city] = [];
      acc[city].push(store);
      return acc;
    },
    {}
  );

  return (
    <main>
      {/* Page header */}
      <section className="bg-crema-100 pt-(--space-16) pb-(--space-8)">
        <div className="container-site">
          <h1 className="font-display text-4xl lg:text-5xl text-espresso-600">
            Our Locations
          </h1>
          <p className="mt-(--space-2) text-lg text-stone">
            Find your nearest No Time Coffee.
          </p>
        </div>
      </section>

      {/* Store cards grouped by city */}
      <section className="py-(--space-8)">
        <div className="container-site">
          <div className="space-y-(--space-12)">
            {Object.entries(storesByCity).map(([city, cityStores]) => (
              <div key={city}>
                <h2 className="font-display text-2xl lg:text-3xl text-espresso-600 mb-(--space-6) border-b border-mist pb-(--space-2)">
                  {city}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-(--space-6)">
                  {cityStores.map((store: any) => (
                    <StoreCard key={store._id} store={store} variant="full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
