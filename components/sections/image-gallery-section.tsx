"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";

type GalleryImage = {
  asset: { _id: string; url: string; metadata: { lqip: string; dimensions: { width: number; height: number } } };
  alt?: string;
  caption?: string;
  hotspot?: { x: number; y: number };
  crop?: { top: number; bottom: number; left: number; right: number };
};

type ImageGallerySectionProps = {
  heading?: string;
  images: GalleryImage[];
  layout?: "grid" | "carousel" | "masonry";
};

function GridLayout({ images }: { images: GalleryImage[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-(--space-4)">
      {images.map((image) => (
        <div
          key={image.asset._id}
          className="group relative overflow-hidden rounded-(--radius-lg) aspect-[4/3]"
        >
          <Image
            src={urlFor(image).width(500).height(375).url()}
            alt={image.alt || ""}
            fill
            className="object-cover transition-transform duration-(--transition-base) group-hover:scale-[1.02]"
            placeholder="blur"
            blurDataURL={image.asset.metadata.lqip}
          />
          {image.caption && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/60 to-transparent p-(--space-3) pt-(--space-8)">
              <p className="text-sm text-white">{image.caption}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CarouselLayout({ images }: { images: GalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-(--radius-lg)">
        <div
          className="flex transition-transform duration-(--transition-slow)"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {images.map((image) => (
            <div
              key={image.asset._id}
              className="w-full shrink-0 aspect-[16/9] relative"
            >
              <Image
                src={urlFor(image).width(1200).height(675).url()}
                alt={image.alt || ""}
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL={image.asset.metadata.lqip}
              />
              {image.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/60 to-transparent p-(--space-4) pt-(--space-8)">
                  <p className="text-base text-white">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
            disabled={activeIndex === 0}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-(--shadow-md) hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous image"
          >
            ←
          </button>
          <button
            onClick={() => setActiveIndex((i) => Math.min(images.length - 1, i + 1))}
            disabled={activeIndex === images.length - 1}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-(--shadow-md) hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next image"
          >
            →
          </button>
          {/* Dots */}
          <div className="flex justify-center gap-(--space-2) mt-(--space-4)">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to image ${index + 1}`}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-(--transition-fast)",
                  index === activeIndex
                    ? "bg-forest-600 scale-125"
                    : "bg-pebble hover:bg-stone"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function MasonryLayout({ images }: { images: GalleryImage[] }) {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-(--space-3)">
      {images.map((image) => (
        <div
          key={image.asset._id}
          className="break-inside-avoid mb-(--space-3) group relative overflow-hidden rounded-(--radius-lg)"
        >
          <Image
            src={urlFor(image).width(500).url()}
            alt={image.alt || ""}
            width={image.asset.metadata.dimensions.width}
            height={image.asset.metadata.dimensions.height}
            className="w-full transition-transform duration-(--transition-base) group-hover:scale-[1.02]"
            placeholder="blur"
            blurDataURL={image.asset.metadata.lqip}
          />
          {image.caption && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/60 to-transparent p-(--space-3) pt-(--space-8)">
              <p className="text-sm text-white">{image.caption}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ImageGallerySection({
  heading,
  images,
  layout = "grid",
}: ImageGallerySectionProps) {
  if (!images || images.length === 0) return null;

  const layoutComponents = {
    grid: GridLayout,
    carousel: CarouselLayout,
    masonry: MasonryLayout,
  };

  const LayoutComponent = layoutComponents[layout];

  return (
    <section className="py-(--space-12) lg:py-(--space-16)">
      <div className="container-site">
        {heading && (
          <h2 className="font-display text-3xl lg:text-4xl text-espresso-600 text-center mb-(--space-8)">
            {heading}
          </h2>
        )}
        <LayoutComponent images={images} />
      </div>
    </section>
  );
}

export { ImageGallerySection, type ImageGallerySectionProps };
