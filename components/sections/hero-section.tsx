import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HeroSectionProps = {
  headline: string;
  subheadline?: string;
  backgroundImage?: {
    asset: { _id: string; url: string; metadata: { lqip: string; dimensions: { width: number; height: number } } };
    alt?: string;
    hotspot?: { x: number; y: number };
    crop?: { top: number; bottom: number; left: number; right: number };
  };
  backgroundVideo?: string;
  ctaText?: string;
  ctaLink?: string;
  style?: "full" | "split" | "minimal";
};

function HeroSection({
  headline,
  subheadline,
  backgroundImage,
  backgroundVideo,
  ctaText,
  ctaLink,
  style = "split",
}: HeroSectionProps) {
  if (style === "minimal") {
    return (
      <section className="py-(--space-24) bg-crema-50">
        <div className="container-site text-center max-w-3xl mx-auto">
          <h1 className="font-display text-[clamp(2.5rem,5vw,3.5rem)] leading-tight text-espresso-600 text-balance">
            {headline}
          </h1>
          {subheadline && (
            <p className="mt-(--space-4) text-lg text-stone max-w-[50ch] mx-auto">
              {subheadline}
            </p>
          )}
          {ctaText && ctaLink && (
            <div className="mt-(--space-6)">
              <Button variant="primary" size="lg" asChild>
                <a href={ctaLink}>{ctaText}</a>
              </Button>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (style === "full") {
    return (
      <section className="relative min-h-[calc(100vh-var(--header-height))] flex items-center">
        {/* Background */}
        {backgroundVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>
        ) : backgroundImage ? (
          <Image
            src={urlFor(backgroundImage).width(1920).height(1080).url()}
            alt={backgroundImage.alt || ""}
            fill
            className="object-cover"
            priority
            placeholder="blur"
            blurDataURL={backgroundImage.asset.metadata.lqip}
          />
        ) : null}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-espresso-600/70 to-espresso-600/30" />
        {/* Content */}
        <div className="container-site relative z-10 py-(--space-24)">
          <div className="max-w-2xl">
            <h1 className="font-display text-[clamp(2.5rem,5vw,3.5rem)] leading-tight text-crema-100 text-balance">
              {headline}
            </h1>
            {subheadline && (
              <p className="mt-(--space-4) text-lg text-crema-200 max-w-[50ch]">
                {subheadline}
              </p>
            )}
            {ctaText && ctaLink && (
              <div className="mt-(--space-6)">
                <Button variant="accent" size="lg" asChild>
                  <a href={ctaLink}>{ctaText}</a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Default: split layout (per @bloom's spec — content left 45%, image right 55%)
  return (
    <section className="min-h-[calc(100vh-var(--header-height))] flex flex-col lg:flex-row">
      {/* Content — left side on desktop, below image on mobile */}
      <div className="flex-1 lg:w-[45%] flex items-center order-2 lg:order-1">
        <div className="container-site py-(--space-12) lg:py-(--space-24) lg:pr-(--space-16)">
          <p className="text-xs font-medium uppercase tracking-widest text-sage-400 mb-(--space-4)">
            Amsterdam · Arnhem · Den Haag
          </p>
          <h1 className="font-display text-[clamp(2.5rem,5vw,3.5rem)] leading-tight text-espresso-600 text-balance">
            {headline}
          </h1>
          {subheadline && (
            <p className="mt-(--space-4) text-lg text-stone max-w-[50ch]">
              {subheadline}
            </p>
          )}
          <div className="mt-(--space-6) flex flex-wrap gap-(--space-3)">
            {ctaText && ctaLink && (
              <Button variant="primary" size="lg" asChild>
                <a href={ctaLink}>{ctaText}</a>
              </Button>
            )}
            <Button variant="secondary" size="lg" asChild>
              <a href="/locations">Find a Store</a>
            </Button>
          </div>
        </div>
      </div>
      {/* Image — right side on desktop, top on mobile */}
      <div className="lg:w-[55%] h-[50vh] lg:h-auto order-1 lg:order-2 relative">
        {backgroundImage && (
          <Image
            src={urlFor(backgroundImage).width(1200).height(900).url()}
            alt={backgroundImage.alt || ""}
            fill
            className="object-cover"
            priority
            placeholder="blur"
            blurDataURL={backgroundImage.asset.metadata.lqip}
          />
        )}
      </div>
    </section>
  );
}

export { HeroSection, type HeroSectionProps };
