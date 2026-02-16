import { sanityFetch } from "@/sanity/lib/fetch";
import { STORES_QUERY } from "@/sanity/lib/queries";
import type { STORES_QUERYResult } from "@/sanity/types";
import { StoreCard } from "@/components/ui/store-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type StoreListSectionProps = {
  heading?: string;
  showMap?: boolean;
};

async function StoreListSection({
  heading = "Find Us",
  showMap = true,
}: StoreListSectionProps) {
  const stores = await sanityFetch<STORES_QUERYResult>({
    query: STORES_QUERY,
    tags: ["store"],
  });

  if (!stores || stores.length === 0) return null;

  return (
    <section className="py-(--space-12) lg:py-(--space-16)">
      <div className="container-site">
        <div className="text-center mb-(--space-8)">
          <h2 className="font-display text-3xl lg:text-4xl text-espresso-600">
            {heading}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-(--space-6)">
          {stores.map((store) => (
            <StoreCard key={store._id} store={store} variant="compact" />
          ))}
        </div>
        <div className="text-center mt-(--space-8)">
          <Button variant="tertiary" size="md" asChild>
            <Link href="/locations">All Locations →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export { StoreListSection, type StoreListSectionProps };
