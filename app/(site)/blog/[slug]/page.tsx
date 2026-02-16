import { notFound } from "next/navigation";
import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import {
  BLOG_POST_BY_SLUG_QUERY,
  BLOG_POSTS_QUERY,
} from "@/sanity/lib/queries";
import type {
  BLOG_POST_BY_SLUG_QUERYResult,
  BLOG_POSTS_QUERYResult,
} from "@/sanity/types";
import { PortableTextRenderer } from "@/components/sanity/portable-text";
import { BlogCard } from "@/components/ui/blog-card";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { ShareBar } from "@/components/blog/share-bar";
import type { Metadata } from "next";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityFetch<BLOG_POST_BY_SLUG_QUERYResult>({
    query: BLOG_POST_BY_SLUG_QUERY,
    params: { slug },
    tags: ["blogPost"],
  });

  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author || "No Time Coffee Team"],
      images: post.mainImage?.asset?.url
        ? [{ url: post.mainImage.asset.url }]
        : [],
    },
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-NL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Estimate reading time from portable text body */
function estimateReadingTime(
  body: BLOG_POST_BY_SLUG_QUERYResult extends null ? never : NonNullable<BLOG_POST_BY_SLUG_QUERYResult>["body"]
): number {
  let wordCount = 0;
  for (const block of body) {
    if ("children" in block && block.children) {
      for (const child of block.children) {
        if (child.text) {
          wordCount += child.text.split(/\s+/).filter(Boolean).length;
        }
      }
    }
  }
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * Build related posts list — always 3, always exclude current post.
 * Priority: manual relatedPosts → same category → latest overall.
 */
async function getRelatedPosts(
  post: NonNullable<BLOG_POST_BY_SLUG_QUERYResult>,
): Promise<BLOG_POSTS_QUERYResult> {
  const related: BLOG_POSTS_QUERYResult = [];
  const usedIds = new Set<string>([post._id]);

  // 1. Manual related posts from the post itself
  if (post.relatedPosts) {
    for (const rp of post.relatedPosts) {
      if (related.length >= 3) break;
      if (!usedIds.has(rp._id)) {
        related.push(rp as any);
        usedIds.add(rp._id);
      }
    }
  }

  // 2. Backfill from all posts if we need more
  if (related.length < 3) {
    const allPosts = await sanityFetch<BLOG_POSTS_QUERYResult>({
      query: BLOG_POSTS_QUERY,
      tags: ["blogPost"],
    });

    if (allPosts) {
      // Same category first
      const postCategories = post.categories ?? [];
      if (postCategories.length > 0) {
        for (const p of allPosts) {
          if (related.length >= 3) break;
          if (usedIds.has(p._id)) continue;
          const pCats = p.categories ?? [];
          if (pCats.some((c) => postCategories.includes(c))) {
            related.push(p);
            usedIds.add(p._id);
          }
        }
      }

      // Then latest overall
      for (const p of allPosts) {
        if (related.length >= 3) break;
        if (usedIds.has(p._id)) continue;
        related.push(p);
        usedIds.add(p._id);
      }
    }
  }

  return related;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await sanityFetch<BLOG_POST_BY_SLUG_QUERYResult>({
    query: BLOG_POST_BY_SLUG_QUERY,
    params: { slug },
    tags: ["blogPost"],
  });

  if (!post) notFound();

  const readingTime = estimateReadingTime(post.body);
  const relatedPosts = await getRelatedPosts(post);
  const authorName = post.author || "No Time Coffee Team";

  return (
    <>
      {/* JSON-LD Article structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            image: post.mainImage?.asset?.url ?? undefined,
            author: {
              "@type": "Person",
              name: authorName,
            },
            publisher: {
              "@type": "Organization",
              name: "No Time Coffee",
            },
            datePublished: post.publishedAt,
          }),
        }}
      />

      {/* Reading progress bar — client component */}
      <ReadingProgress />

      <main>
        {/* Article header */}
        <header className="pt-(--space-16) pb-(--space-8)">
          <div className="container-site max-w-[800px] mx-auto text-center">
            {/* Category pill */}
            {post.categories && post.categories.length > 0 && (
              <span className="inline-block bg-sage-100 text-forest-600 text-sm font-medium px-3 py-1 rounded-full mb-(--space-4)">
                {post.categories[0].charAt(0).toUpperCase() +
                  post.categories[0].slice(1)}
              </span>
            )}

            {/* Title */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-display text-espresso-600 mb-(--space-4)">
              {post.title}
            </h1>

            {/* Excerpt / subtitle */}
            <p className="text-lg text-stone max-w-[640px] mx-auto mb-(--space-6)">
              {post.excerpt}
            </p>

            {/* Author + date + reading time */}
            <div className="flex items-center justify-center gap-(--space-3)">
              {/* Avatar placeholder */}
              <div className="w-10 h-10 rounded-full bg-sage-200 flex items-center justify-center text-forest-600 font-medium text-sm">
                {authorName.charAt(0)}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-espresso-600">
                  {authorName}
                </p>
                <p className="text-sm text-pebble">
                  <time dateTime={post.publishedAt}>
                    {formatDate(post.publishedAt)}
                  </time>
                  {" · "}
                  {readingTime} min read
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Hero image — full container width */}
        {post.mainImage?.asset?.url && (
          <div className="container-site mb-(--space-12)">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={urlFor(post.mainImage).width(1280).height(720).url()}
                alt={post.mainImage.alt || post.title}
                fill
                className="object-cover"
                placeholder={post.mainImage.asset.metadata?.lqip ? "blur" : undefined}
                blurDataURL={post.mainImage.asset.metadata?.lqip ?? undefined}
                sizes="(max-width: 1280px) 100vw, 1280px"
                priority
              />
            </div>
          </div>
        )}

        {/* Article body — 720px centered column */}
        <article
          aria-label={post.title}
          className="container-site max-w-[720px] mx-auto mb-(--space-12)"
        >
          <div className="prose-ntc">
            <PortableTextRenderer value={post.body} />
          </div>
        </article>

        {/* Share bar */}
        <div className="container-site max-w-[720px] mx-auto border-t border-crema-200">
          <ShareBar title={post.title} />
        </div>

        {/* Author bio card */}
        <div className="container-site max-w-[720px] mx-auto my-(--space-12)">
          <div className="bg-crema-50 rounded-lg p-(--space-6) flex items-center gap-(--space-4)">
            <div className="w-16 h-16 rounded-full bg-sage-200 flex items-center justify-center text-forest-600 font-semibold text-xl shrink-0">
              {authorName.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-espresso-600">{authorName}</p>
              <p className="text-sm text-stone mt-1">
                Writing about coffee, culture, and what happens behind the bar.
              </p>
            </div>
          </div>
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="py-(--space-12) border-t border-crema-200">
            <div className="container-site">
              <h2 className="font-display text-2xl lg:text-3xl text-espresso-600 text-center mb-(--space-8)">
                More stories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-(--space-6)">
                {relatedPosts.map((rp) => (
                  <BlogCard key={rp._id} post={rp as any} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
