import { Suspense } from "react";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PRODUCTS_QUERY, PRODUCT_CATEGORIES_QUERY } from "@/sanity/lib/queries";
import type { PRODUCTS_QUERYResult, PRODUCT_CATEGORIES_QUERYResult } from "@/sanity/types";
import { ProductCard } from "@/components/ui/product-card";
import { MenuFilterBar } from "@/components/sections/menu-filter-bar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu — No Time Coffee",
  description: "Specialty coffee, teas, and food crafted with care. Browse our full menu.",
};

type MenuPageProps = {
  searchParams: Promise<{
    category?: string;
    dietary?: string | string[];
  }>;
};

// Extract unique dietary flags from all items
function extractDietaryFlags(items: PRODUCTS_QUERYResult): string[] {
  const flags = new Set<string>();
  for (const item of items) {
    if (item.dietaryFlags) {
      for (const flag of item.dietaryFlags) {
        flags.add(flag);
      }
    }
  }
  return Array.from(flags).sort();
}

// Group items by category, respecting category sort order
function groupByCategory(
  items: PRODUCTS_QUERYResult,
  categories: PRODUCT_CATEGORIES_QUERYResult
) {
  const groups: Array<{
    category: PRODUCT_CATEGORIES_QUERYResult[number];
    items: PRODUCTS_QUERYResult;
  }> = [];

  for (const cat of categories) {
    const catItems = items.filter(
      (item) => item.category?.slug?.current === cat.slug.current
    );
    if (catItems.length > 0) {
      groups.push({ category: cat, items: catItems });
    }
  }

  // Items without a category (shouldn't happen, but fail visibly)
  const uncategorized = items.filter((item) => !item.category);
  if (uncategorized.length > 0) {
    console.error(
      `[MenuPage] ${uncategorized.length} items have no category:`,
      uncategorized.map((i) => i.name)
    );
  }

  return groups;
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const params = await searchParams;
  const categoryFilter = params.category || null;
  const dietaryFilter = Array.isArray(params.dietary)
    ? params.dietary
    : params.dietary
      ? [params.dietary]
      : [];

  const [allItems, categories] = await Promise.all([
    sanityFetch<PRODUCTS_QUERYResult>({
      query: PRODUCTS_QUERY,
      tags: ["product"],
    }),
    sanityFetch<PRODUCT_CATEGORIES_QUERYResult>({
      query: PRODUCT_CATEGORIES_QUERY,
      tags: ["productCategory"],
    }),
  ]);

  // Apply filters server-side
  let filteredItems = allItems;

  if (categoryFilter) {
    filteredItems = filteredItems.filter(
      (item) => item.category?.slug?.current === categoryFilter
    );
  }

  if (dietaryFilter.length > 0) {
    filteredItems = filteredItems.filter((item) =>
      dietaryFilter.every((flag) => item.dietaryFlags?.includes(flag))
    );
  }

  const dietaryFlags = extractDietaryFlags(allItems);
  const groups = groupByCategory(filteredItems, categories);
  const hasFilters = !!categoryFilter || dietaryFilter.length > 0;

  return (
    <main>
      {/* Page header */}
      <section className="bg-crema-100 pt-(--space-16) pb-(--space-8)">
        <div className="container-site">
          <h1 className="font-display text-4xl lg:text-5xl text-espresso-600">
            Our Menu
          </h1>
          <p className="mt-(--space-2) text-lg text-stone">
            Crafted with care, served at speed.
          </p>
        </div>
      </section>

      {/* Sticky filter bar */}
      <Suspense>
        <MenuFilterBar
          categories={categories}
          dietaryFlags={dietaryFlags}
          totalItems={allItems.length}
          filteredCount={filteredItems.length}
        />
      </Suspense>

      {/* Menu items grouped by category */}
      <section className="py-(--space-8)" style={{ minHeight: "50vh" }}>
        <div className="container-site">
          {groups.length === 0 ? (
            <div className="text-center py-(--space-16)">
              {hasFilters ? (
                <>
                  <p className="text-4xl mb-(--space-4)">🔍</p>
                  <p className="text-lg text-stone">No items match your filters.</p>
                  <a
                    href="/menu"
                    className="inline-block mt-(--space-4) text-forest-600 underline hover:text-forest-500"
                  >
                    Clear filters
                  </a>
                </>
              ) : (
                <>
                  <p className="text-4xl mb-(--space-4)">☕</p>
                  <p className="text-lg text-stone">No items in this category yet. Check back soon!</p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-(--space-12)">
              {groups.map(({ category, items }) => (
                <section
                  key={category._id}
                  id={category.slug.current}
                  style={{
                    scrollMarginTop: "calc(var(--header-height) + 5rem + var(--space-4))",
                  }}
                >
                  <div className="flex items-baseline gap-(--space-3) mb-(--space-6) border-b border-mist pb-(--space-2)">
                    <h2 className="font-display text-2xl lg:text-3xl text-espresso-600">
                      {category.icon && (
                        <span className="mr-2" aria-hidden="true">{category.icon}</span>
                      )}
                      {category.name}
                    </h2>
                    <span className="text-sm text-stone">({items.length})</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-(--space-6)">
                    {items.map((item) => (
                      <ProductCard key={item._id} item={item} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
