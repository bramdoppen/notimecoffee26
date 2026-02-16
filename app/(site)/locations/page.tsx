import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Locations",
  description:
    "Find No Time Coffee near you. Locations in Amsterdam, Arnhem & Den Haag.",
};

export default function LocationsPage() {
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
            Store locator coming soon. Visit us at our three locations.
          </p>
        </div>
      </section>
    </main>
  );
}
