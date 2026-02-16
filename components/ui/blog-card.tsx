import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { Card, CardImage, CardContent } from "./card";
import { cn } from "@/lib/utils";

type BlogCardProps = {
  post: {
    title: string;
    slug: { current: string };
    author: string;
    publishedAt: string;
    excerpt: string;
    categories?: string[];
    mainImage: {
      asset: { _id: string; url: string; metadata: { lqip: string; dimensions: { width: number; height: number } } };
      alt?: string;
    };
  };
  className?: string;
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-NL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function BlogCard({ post, className }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug.current}`} className={cn("block", className)}>
      <Card className="h-full">
        <CardImage aspectRatio="16/9">
          {post.mainImage ? (
            <Image
              src={urlFor(post.mainImage).width(600).height(338).url()}
              alt={post.mainImage.alt || post.title}
              width={600}
              height={338}
              className="w-full h-full object-cover"
              {...(post.mainImage.asset?.metadata?.lqip ? { placeholder: "blur" as const, blurDataURL: post.mainImage.asset.metadata.lqip } : {})}
            />
          ) : (
            <div className="w-full h-full bg-crema-200 flex items-center justify-center text-4xl">📝</div>
          )}
        </CardImage>
        <CardContent className="flex flex-col gap-(--space-2)">
          {post.categories && post.categories.length > 0 && (
            <span className="text-xs font-medium uppercase tracking-wider text-terracotta-500">
              {post.categories[0]}
            </span>
          )}
          <h3 className="font-display text-xl text-espresso-600">
            {post.title}
          </h3>
          <p className="text-base text-stone line-clamp-3">
            {post.excerpt}
          </p>
          <p className="text-sm text-pebble mt-auto pt-(--space-2)">
            {formatDate(post.publishedAt)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

export { BlogCard, type BlogCardProps };
