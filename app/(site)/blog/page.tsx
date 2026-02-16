import { Suspense } from "react";
import { sanityFetch } from "@/sanity/lib/fetch";
import { BLOG_POSTS_QUERY } from "@/sanity/lib/queries";
import { FeaturedPost } from "@/components/blog/featured-post";
import { BlogListing } from "@/components/blog/blog-listing";
import { BlogNewsletterCta } from "@/components/blog/blog-newsletter-cta";
import type { Metadata } from "next";

// TODO: Replace with generated types once @grind runs sanity typegen generate
type BlogPostsQueryResult = any[];

export const metadata: Metadata = {
  title: "Stories",
  description:
    "Brewing guides, origin stories, and life behind the bar at No Time Coffee.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const posts = await sanityFetch<BlogPostsQueryResult>({
    query: BLOG_POSTS_QUERY,
    tags: ["blogPost"],
  });

  if (!posts || posts.length === 0) {
    return (
      <main>
        <section className="bg-crema-100 pt-(--space-16) pb-(--space-8)">
          <div className="container-site">
            <h1 className="font-display text-4xl lg:text-5xl text-espresso-600">
              Stories
            </h1>
            <p className="mt-(--space-2) text-lg text-stone">
              Brewing guides, origin stories, and life behind the bar.
            </p>
          </div>
        </section>
        <section className="py-(--space-16)">
          <div className="container-site text-center">
            <p className="text-4xl mb-(--space-4)">☕</p>
            <p className="text-lg text-stone">
              Stories are brewing. Check back soon!
            </p>
          </div>
        </section>
      </main>
    );
  }

  // Featured post: most recent post (already sorted by publishedAt desc)
  const featuredPost = posts[0];
  // Remaining posts for the grid (exclude featured)
  const remainingPosts = posts.slice(1);

  return (
    <main>
      {/* Page header */}
      <section className="bg-crema-100 pt-(--space-16) pb-(--space-8)">
        <div className="container-site">
          <h1 className="font-display text-4xl lg:text-5xl text-espresso-600">
            Stories
          </h1>
          <p className="mt-(--space-2) text-lg text-stone">
            Brewing guides, origin stories, and life behind the bar.
          </p>
        </div>
      </section>

      {/* Featured post hero */}
      <section className="py-(--space-8)">
        <div className="container-site">
          <FeaturedPost post={featuredPost} />
        </div>
      </section>

      {/* Category filter + post grid + load more */}
      {remainingPosts.length > 0 && (
        <section className="py-(--space-8)">
          <Suspense fallback={null}>
            <BlogListing
              posts={remainingPosts}
              initialCategory={params.category ?? null}
            />
          </Suspense>
        </section>
      )}

      {/* Newsletter CTA — dark variant (client component for form) */}
      <BlogNewsletterCta />
    </main>
  );
}
