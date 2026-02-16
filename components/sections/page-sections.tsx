import { HeroSection } from "./hero-section";
import { TextSection } from "./text-section";
import { FeaturedMenuSection } from "./featured-menu-section";
import { StoreListSection } from "./store-list-section";
import { ImageGallerySection } from "./image-gallery-section";
import { CtaSection } from "./cta-section";
import { TestimonialSection } from "./testimonial-section";
import { NewsletterSection } from "./newsletter-section";

type Section = {
  _type: string;
  _key: string;
  [key: string]: unknown;
};

type PageSectionsProps = {
  sections: Section[];
};

const sectionMap: Record<string, React.ComponentType<any>> = {
  heroSection: HeroSection,
  textSection: TextSection,
  featuredMenuSection: FeaturedMenuSection,
  storeListSection: StoreListSection,
  imageGallerySection: ImageGallerySection,
  ctaSection: CtaSection,
  testimonialSection: TestimonialSection,
  newsletterSection: NewsletterSection,
};

function PageSections({ sections }: PageSectionsProps) {
  if (!sections || sections.length === 0) return null;

  return (
    <>
      {sections.map((section) => {
        const Component = sectionMap[section._type];

        if (!Component) {
          if (process.env.NODE_ENV === "development") {
            console.error(
              `[PageSections] Unknown section type: "${section._type}" (key: ${section._key}). ` +
              `Available types: ${Object.keys(sectionMap).join(", ")}`
            );
          }
          return null;
        }

        // Spread section props, excluding internal fields
        const { _type, _key, ...props } = section;
        return <Component key={_key} {...props} />;
      })}
    </>
  );
}

export { PageSections, type PageSectionsProps };
