"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BlogCard } from "@/components/ui/blog-card";
import { BlogCategoryFilter } from "./blog-category-filter";
import { Button } from "@/components/ui/button";
import type { BLOG_POSTS_QUERYResult } from "@/sanity/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BlogPost = BLOG_POSTS_QUERYResult[number];

type BlogListingProps = {
  /** All posts (excluding featured post if shown separately) */
  posts: BlogPost[];
  /** Initial category from URL searchParams */
  initialCategory?: string | null;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const POSTS_PER_PAGE = 6;

// ---------------------------------------------------------------------------
// BlogListing — category filter + grid + load more
// ---------------------------------------------------------------------------

export function BlogListing({ posts, initialCategory = null }: BlogListingProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string | null>(
    initialCategory
  );
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  // ---- Derive categories from actual posts (only categories with ≥1 post) ----
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    for (const post of posts) {
      if (post.categories) {
        for (const cat of post.categories) {
          categorySet.add(cat);
        }
      }
    }
    return Array.from(categorySet).sort();
  }, [posts]);

  // ---- Filter posts by active category ----
  const filteredPosts = useMemo(() => {
    if (!activeCategory) return posts;
    return posts.filter(
      (p) => p.categories && p.categories.includes(activeCategory)
    );
  }, [posts, activeCategory]);

  // ---- Visible slice for pagination ----
  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  // ---- Category change — update URL for shareability ----
  const handleCategoryChange = useCallback(
    (category: string | null) => {
      setActiveCategory(category);
      setVisibleCount(POSTS_PER_PAGE); // Reset pagination on filter change

      const params = new URLSearchParams(searchParams.toString());
      if (category) {
        params.set("category", category);
      } else {
        params.delete("category");
      }
      const query = params.toString();
      router.push(query ? `/blog?${query}` : "/blog", { scroll: false });
    },
    [router, searchParams]
  );

  // ---- Load more ----
  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + POSTS_PER_PAGE);
  }, []);

  return (
    <>
      {/* Category filter pills */}
      {categories.length > 0 && (
        <div className="container-site mb-(--space-8)">
          <BlogCategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
      )}

      {/* Post grid */}
      <div className="container-site">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-(--space-16)">
            <p className="text-4xl mb-(--space-4)">☕</p>
            <p className="text-lg text-stone mb-(--space-4)">
              No stories in this category yet. Check back soon!
            </p>
            <button
              onClick={() => handleCategoryChange(null)}
              className="text-forest-600 font-medium hover:underline"
            >
              View all stories →
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-(--space-6)">
              {visiblePosts.map((post) => (
                <BlogCard key={post._id} post={post as any} />
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="text-center mt-(--space-10)">
                <Button variant="secondary" onClick={handleLoadMore}>
                  Load more stories
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
