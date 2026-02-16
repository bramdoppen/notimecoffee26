import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Compact product embed for inline use in portable text
function ProductEmbed({
  product,
}: {
  product: {
    name: string;
    slug: { current: string };
    price: number;
    image: { asset: { _id: string; url: string; metadata: { lqip: string } }; alt?: string };
    category?: { name: string; icon?: string };
  };
}) {
  return (
    <Link
      href={`/menu#${product.slug.current}`}
      className="block my-(--space-4) not-prose"
    >
      <Card className="flex flex-row items-center gap-(--space-3) p-(--space-3)">
        <div className="w-16 h-16 rounded-(--radius-md) overflow-hidden shrink-0">
          <Image
            src={urlFor(product.image).width(128).height(128).url()}
            alt={product.image.alt || product.name}
            width={128}
            height={128}
            className="w-full h-full object-cover"
            placeholder="blur"
            blurDataURL={product.image.asset.metadata.lqip}
          />
        </div>
        <div className="flex-1 min-w-0">
          {product.category && (
            <span className="text-xs text-sage-600">
              {product.category.icon} {product.category.name}
            </span>
          )}
          <p className="font-medium text-espresso-600 truncate">{product.name}</p>
        </div>
        <span className="text-lg font-semibold text-terracotta-500 shrink-0">
          €{product.price.toFixed(2)}
        </span>
      </Card>
    </Link>
  );
}

// Compact store embed for inline use in portable text
function StoreEmbed({
  store,
}: {
  store: {
    name: string;
    slug: { current: string };
    city: string;
    address: string;
    image: { asset: { _id: string; url: string; metadata: { lqip: string } }; alt?: string };
  };
}) {
  return (
    <Link
      href={`/locations#${store.slug.current}`}
      className="block my-(--space-4) not-prose"
    >
      <Card className="flex flex-row items-center gap-(--space-3) p-(--space-3)">
        <div className="w-16 h-16 rounded-(--radius-md) overflow-hidden shrink-0">
          <Image
            src={urlFor(store.image).width(128).height(128).url()}
            alt={store.image.alt || store.name}
            width={128}
            height={128}
            className="w-full h-full object-cover"
            placeholder="blur"
            blurDataURL={store.image.asset.metadata.lqip}
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-xs font-medium uppercase tracking-wider text-forest-600">
            {store.city}
          </span>
          <p className="font-medium text-espresso-600 truncate">{store.name}</p>
          <p className="text-sm text-stone truncate">{store.address}</p>
        </div>
      </Card>
    </Link>
  );
}

// CTA button embed for inline use in portable text
function CtaButtonEmbed({
  text,
  url,
  style = "primary",
}: {
  text: string;
  url: string;
  style?: "primary" | "secondary" | "outline";
}) {
  const variantMap = {
    primary: "primary",
    secondary: "secondary",
    outline: "secondary",
  } as const;

  return (
    <span className="inline-flex my-(--space-2) not-prose">
      <Button variant={variantMap[style]} size="md" asChild>
        <a href={url}>{text}</a>
      </Button>
    </span>
  );
}

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-(--space-8)">
          <Image
            src={urlFor(value).width(800).url()}
            alt={value.alt || ""}
            width={value.asset.metadata?.dimensions?.width || 800}
            height={value.asset.metadata?.dimensions?.height || 600}
            className="w-full rounded-(--radius-lg)"
            placeholder={value.asset.metadata?.lqip ? "blur" : undefined}
            blurDataURL={value.asset.metadata?.lqip}
          />
          {value.caption && (
            <figcaption className="text-sm text-stone mt-(--space-2) text-center">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    productEmbed: ({ value }) => {
      if (!value?.product) return null;
      return <ProductEmbed product={value.product} />;
    },
    storeEmbed: ({ value }) => {
      if (!value?.store) return null;
      return <StoreEmbed store={value.store} />;
    },
    ctaButton: ({ value }) => {
      if (!value?.text || !value?.url) return null;
      return <CtaButtonEmbed text={value.text} url={value.url} style={value.style} />;
    },
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || "";
      const isExternal = href.startsWith("http");
      return (
        <a
          href={href}
          className="text-forest-600 underline underline-offset-2 hover:text-forest-500 transition-colors duration-(--transition-fast)"
          {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
        >
          {children}
        </a>
      );
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="font-display text-3xl text-espresso-600 mt-(--space-12) mb-(--space-4)">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-body font-medium text-2xl text-espresso-600 mt-(--space-8) mb-(--space-3)">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-body font-medium text-xl text-espresso-600 mt-(--space-6) mb-(--space-2)">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-sage-400 pl-(--space-4) my-(--space-6) text-lg italic text-espresso-500">
        {children}
      </blockquote>
    ),
  },
};

type PortableTextRendererProps = {
  value: any[];
  className?: string;
};

function PortableTextRenderer({ value, className }: PortableTextRendererProps) {
  if (!value) return null;
  return (
    <div
      className={cn(
        "prose prose-lg max-w-none",
        "prose-p:text-stone prose-p:leading-relaxed",
        "prose-li:text-stone",
        "prose-strong:text-espresso-600",
        className
      )}
    >
      <PortableText value={value} components={portableTextComponents} />
    </div>
  );
}

export { PortableTextRenderer, portableTextComponents };
