import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/fetch";
import { FEATURED_PRODUCTS_QUERY } from "@/sanity/lib/queries";
// TODO: Replace with generated types once @grind runs `sanity typegen generate`
type FeaturedProductsQueryResult = any[];
import { ProductCard } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";

type FeaturedMenuSectionProps = {
  heading?: string;
  description?: string;
  autoFeatured: boolean;
  maxItems?: number;
  items?: FeaturedProductsQueryResult;
};

async function FeaturedMenuSection({
  heading = "Our Favorites",
  description,
  autoFeatured,
  maxItems = 6,
  items: manualItems,
}: FeaturedMenuSectionProps) {
  const items = autoFeatured
    ? await sanityFetch<FeaturedProductsQueryResult>({
        query: FEATURED_PRODUCTS_QUERY,
        params: { limit: maxItems },
        tags: ["product"],
      })
    : manualItems ?? [];

  if (!items || items.length === 0) return null;

  return (
    <section className="py-(--space-12) lg:py-(--space-16) bg-crema-100">
      <div className="container-site">
        <div className="text-center mb-(--space-8)">
          <h2 className="font-display text-3xl lg:text-4xl text-espresso-600">
            {heading}
          </h2>
          {description && (
            <p className="mt-(--space-2) text-lg text-stone">
              {description}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-(--space-6)">
          {items.map((item) => (
            <ProductCard key={item._id} item={item} />
          ))}
        </div>
        <div className="text-center mt-(--space-8)">
          <Button variant="tertiary" size="md" asChild>
            <Link href="/menu">See Full Menu →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export { FeaturedMenuSection, type FeaturedMenuSectionProps };
