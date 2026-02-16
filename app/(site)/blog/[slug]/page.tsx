import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/fetch";
import { BLOG_POST_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { PortableTextRenderer } from "@/components/sanity/portable-text";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityFetch<any>({
    query: BLOG_POST_BY_SLUG_QUERY,
    params: { slug },
    tags: ["blogPost"],
  });

  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: post.mainImage
      ? {
          images: [
            {
              url: urlFor(post.mainImage).width(1200).height(630).url(),
              width: 1200,
              height: 630,
              alt: post.mainImage.alt || post.title,
            },
          ],
        }
      : undefined,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const post = await sanityFetch<any>({
    query: BLOG_POST_BY_SLUG_QUERY,
    params: { slug },
    tags: ["blogPost"],
  });

  if (!post) notFound();

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <main>
      {/* Article header */}
      <article className="py-(--space-12) lg:py-(--space-16)">
        <div className="container-site max-w-3xl">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm text-forest-600 hover:text-forest-500 mb-(--space-8)"
          >
            ← Back to Blog
          </Link>

          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex gap-2 mb-(--space-4)">
              {post.categories.map((cat: any) => (
                <span
                  key={cat._id}
                  className="text-xs font-medium text-forest-600 bg-sage-100 px-2 py-1 rounded-full"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="font-display text-4xl lg:text-5xl text-espresso-600 text-balance">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-3 mt-(--space-4) text-sm text-stone">
            {post.author && (
              <span className="font-medium text-espresso-500">
                {post.author.name}
              </span>
            )}
            {post.author && publishedDate && (
              <span aria-hidden="true">·</span>
            )}
            {publishedDate && <time dateTime={post.publishedAt}>{publishedDate}</time>}
          </div>

          {/* Hero image */}
          {post.mainImage?.asset && (
            <div className="mt-(--space-8) rounded-(--radius-lg) overflow-hidden">
              <Image
                src={urlFor(post.mainImage).width(1200).height(675).url()}
                alt={post.mainImage.alt || post.title}
                width={1200}
                height={675}
                className="w-full h-auto"
                priority
                placeholder={post.mainImage.asset.metadata?.lqip ? "blur" : undefined}
                blurDataURL={post.mainImage.asset.metadata?.lqip}
              />
            </div>
          )}

          {/* Body */}
          {post.body && (
            <div className="mt-(--space-8)">
              <PortableTextRenderer value={post.body} />
            </div>
          )}

          {/* Related posts */}
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <div className="mt-(--space-16) pt-(--space-8) border-t border-mist">
              <h2 className="font-display text-2xl text-espresso-600 mb-(--space-6)">
                Related Posts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-(--space-6)">
                {post.relatedPosts.map((related: any) => (
                  <Link
                    key={related._id}
                    href={`/blog/${related.slug?.current}`}
                    className="group"
                  >
                    <h3 className="font-medium text-espresso-600 group-hover:text-forest-600 transition-colors">
                      {related.title}
                    </h3>
                    {related.excerpt && (
                      <p className="text-sm text-stone mt-1 line-clamp-2">
                        {related.excerpt}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </main>
  );
}
