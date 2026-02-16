import { sanityFetch } from "@/sanity/lib/fetch";
import { POSTS_QUERY } from "@/sanity/lib/queries";
import { BlogCard } from "@/components/ui/blog-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Stories, recipes, and coffee culture from No Time Coffee.",
};

export default async function BlogPage() {
  const posts = await sanityFetch<any[]>({
    query: POSTS_QUERY,
    tags: ["blogPost"],
  });

  if (!posts || posts.length === 0) {
    return (
      <main>
        <section className="bg-crema-100 pt-(--space-16) pb-(--space-8)">
          <div className="container-site">
            <h1 className="font-display text-4xl lg:text-5xl text-espresso-600">
              Blog
            </h1>
            <p className="mt-(--space-2) text-lg text-stone">
              Stories, recipes, and coffee culture.
            </p>
          </div>
        </section>
        <section className="py-(--space-16)">
          <div className="container-site text-center">
            <p className="text-4xl mb-(--space-4)">✍️</p>
            <p className="text-lg text-stone">
              No posts yet. Add blog posts in Sanity Studio.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      {/* Page header */}
      <section className="bg-crema-100 pt-(--space-16) pb-(--space-8)">
        <div className="container-site">
          <h1 className="font-display text-4xl lg:text-5xl text-espresso-600">
            Blog
          </h1>
          <p className="mt-(--space-2) text-lg text-stone">
            Stories, recipes, and coffee culture.
          </p>
        </div>
      </section>

      {/* Post grid */}
      <section className="py-(--space-8)">
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-(--space-6)">
            {posts.map((post: any) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
