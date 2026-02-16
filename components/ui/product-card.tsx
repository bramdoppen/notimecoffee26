import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { Card, CardImage, CardContent } from "./card";
import { cn } from "@/lib/utils";
import type { PRODUCTS_QUERYResult, FEATURED_PRODUCTS_QUERYResult } from "@/sanity/types";

type ProductCardProps = {
  item: PRODUCTS_QUERYResult[number] | FEATURED_PRODUCTS_QUERYResult[number];
  className?: string;
};

function ProductCard({ item, className }: ProductCardProps) {
  return (
    <Link href={`/menu/${item.slug.current}`} className={cn("block", className)}>
      <Card className="h-full">
        <CardImage>
          <Image
            src={urlFor(item.image).width(400).height(300).url()}
            alt={item.image.alt || item.name}
            width={400}
            height={300}
            className="w-full h-full object-cover"
            {...(item.image.asset?.metadata?.lqip ? { placeholder: "blur", blurDataURL: item.image.asset.metadata.lqip } : {})}
          />
        </CardImage>
        <CardContent className="flex flex-col gap-(--space-2)">
          {item.category && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-sage-600 bg-sage-100 px-2 py-0.5 rounded-full w-fit">
              {item.category.icon && <span aria-hidden="true">{item.category.icon}</span>}
              {item.category.name}
            </span>
          )}
          <h3 className="font-body font-medium text-xl text-espresso-600">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-base text-stone line-clamp-2">
              {item.description}
            </p>
          )}
          <div className="flex items-baseline gap-2 mt-auto pt-(--space-2)">
            <span className="text-xl font-semibold text-terracotta-500">
              €{item.price.toFixed(2)}
            </span>
            {item.priceVariants && item.priceVariants.length > 0 && (
              <span className="text-sm text-pebble">
                from
              </span>
            )}
          </div>
          {"dietaryFlags" in item && item.dietaryFlags && item.dietaryFlags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {item.dietaryFlags.map((flag: string) => (
                <span
                  key={flag}
                  className="text-xs text-forest-600 bg-forest-50 px-1.5 py-0.5 rounded-(--radius-sm)"
                >
                  {flag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export { ProductCard, type ProductCardProps };
