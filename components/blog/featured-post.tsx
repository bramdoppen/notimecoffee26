import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import type { BLOG_POSTS_QUERYResult } from "@/sanity/types";

type FeaturedPostProps = {
  post: BLOG_POSTS_QUERYResult[number];
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-NL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="group block rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[55%_45%]">
        {/* Image — left on desktop, top on mobile */}
        <div className="aspect-video lg:aspect-auto lg:min-h-[360px] relative overflow-hidden">
          {post.mainImage ? (
            <Image
              src={urlFor(post.mainImage).width(800).height(450).url()}
              alt={post.mainImage.alt || post.title}
              fill
              className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
            {...(post.mainImage.asset?.metadata?.lqip ? { placeholder: "blur" as const, blurDataURL: post.mainImage.asset.metadata.lqip } : {})}
              sizes="(max-width: 1024px) 100vw, 55vw"
              priority
            />
          ) : (
            <div className="w-full h-full bg-crema-100 flex items-center justify-center">
              <span className="text-6xl">☕</span>
            </div>
          )}
        </div>

        {/* Content — right on desktop, below on mobile */}
        <div className="p-(--space-6) lg:p-(--space-8) flex flex-col justify-center">
          {post.categories && post.categories.length > 0 && (
            <span className="inline-block self-start bg-sage-100 text-forest-600 text-sm font-medium px-3 py-1 rounded-full mb-(--space-3)">
              {post.categories[0].charAt(0).toUpperCase() + post.categories[0].slice(1)}
            </span>
          )}

          <h2 className="font-display text-2xl lg:text-3xl text-espresso-600 line-clamp-2 mb-(--space-2)">
            {post.title}
          </h2>

          <p className="text-lg text-stone line-clamp-2 mb-(--space-4)">
            {post.excerpt}
          </p>

          <p className="text-sm text-pebble mb-(--space-4)">
            {post.author || "No Time Coffee Team"} · {formatDate(post.publishedAt)}
          </p>

          <span className="text-forest-600 font-medium text-sm group-hover:underline">
            Read the story →
          </span>
        </div>
      </div>
    </Link>
  );
}
