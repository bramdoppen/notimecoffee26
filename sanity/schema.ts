import type { SchemaTypeDefinition } from 'sanity';

// Document schemas
import { property } from './schemas/documents/property';
import { neighborhood } from './schemas/documents/neighborhood';
import { searchProfile } from './schemas/documents/searchProfile';
import { propertyAnalysis } from './schemas/documents/propertyAnalysis';
import { page } from './schemas/documents/page';

// Singleton schemas
import { siteSettings } from './schemas/singletons/siteSettings';
import { userPreferences } from './schemas/singletons/userPreferences';

// Object schemas
import { seoFields } from './schemas/objects/seoFields';
import { portableText } from './schemas/objects/portableText';

// Section schemas (kept: generic page-builder sections)
import { heroSection } from './schemas/objects/sections/heroSection';
import { textSection } from './schemas/objects/sections/textSection';
import { imageGallerySection } from './schemas/objects/sections/imageGallerySection';
import { ctaSection } from './schemas/objects/sections/ctaSection';
import { testimonialSection } from './schemas/objects/sections/testimonialSection';
import { newsletterSection } from './schemas/objects/sections/newsletterSection';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    property,
    neighborhood,
    searchProfile,
    propertyAnalysis,
    page,

    // Singletons
    siteSettings,
    userPreferences,

    // Objects
    seoFields,
    portableText,

    // Sections
    heroSection,
    textSection,
    imageGallerySection,
    ctaSection,
    testimonialSection,
    newsletterSection,
  ],
};
