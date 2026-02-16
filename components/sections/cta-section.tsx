import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CtaSectionProps = {
  heading: string;
  body?: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage?: {
    asset: { _id: string; url: string; metadata: { lqip: string } };
    hotspot?: { x: number; y: number };
    crop?: { top: number; bottom: number; left: number; right: number };
  };
  style?: "primary" | "secondary" | "dark";
};

const styleConfig = {
  primary: {
    bg: "bg-crema-100",
    heading: "text-espresso-600",
    body: "text-stone",
    button: "primary" as const,
  },
  secondary: {
    bg: "bg-sage-50",
    heading: "text-espresso-600",
    body: "text-stone",
    button: "secondary" as const,
  },
  dark: {
    bg: "bg-forest-600",
    heading: "text-crema-100",
    body: "text-sage-300",
    button: "accent" as const,
  },
} as const;

function CtaSection({
  heading,
  body,
  buttonText,
  buttonLink,
  backgroundImage,
  style = "primary",
}: CtaSectionProps) {
  const config = styleConfig[style];

  return (
    <section className={cn("relative py-(--space-16) lg:py-(--space-24)", config.bg)}>
      {backgroundImage && style === "secondary" && (
        <>
          <Image
            src={urlFor(backgroundImage).width(1920).height(600).url()}
            alt=""
            fill
            className="object-cover"
            {...(backgroundImage.asset?.metadata?.lqip ? { placeholder: "blur" as const, blurDataURL: backgroundImage.asset.metadata.lqip } : {})}
          />
          <div className="absolute inset-0 bg-sage-50/85" />
        </>
      )}
      <div className="container-site relative z-10 text-center max-w-[640px] mx-auto">
        <h2 className={cn("font-display text-3xl lg:text-4xl text-balance", config.heading)}>
          {heading}
        </h2>
        {body && (
          <p className={cn("mt-(--space-4) text-lg", config.body)}>
            {body}
          </p>
        )}
        <div className="mt-(--space-6)">
          <Button variant={config.button} size="lg" asChild>
            <a href={buttonLink}>{buttonText}</a>
          </Button>
        </div>
      </div>
    </section>
  );
}

export { CtaSection, type CtaSectionProps };
