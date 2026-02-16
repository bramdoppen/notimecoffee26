import type { SchemaTypeDefinition } from 'sanity';

// Document schemas
import { product } from './schemas/documents/product';
import { productCategory } from './schemas/documents/productCategory';
import { store } from './schemas/documents/store';
import { page } from './schemas/documents/page';
import { blogPost } from './schemas/documents/blogPost';
import { promotion } from './schemas/documents/promotion';
import { person } from './schemas/documents/person';

// Singleton schemas
import { siteSettings } from './schemas/singletons/siteSettings';

// Object schemas
import { surfaceVisibility } from './schemas/objects/surfaceVisibility';
import { seoFields } from './schemas/objects/seoFields';
import { portableText } from './schemas/objects/portableText';

// Section schemas
import { heroSection } from './schemas/objects/sections/heroSection';
import { textSection } from './schemas/objects/sections/textSection';
import { featuredMenuSection } from './schemas/objects/sections/featuredMenuSection';
import { storeListSection } from './schemas/objects/sections/storeListSection';
import { imageGallerySection } from './schemas/objects/sections/imageGallerySection';
import { ctaSection } from './schemas/objects/sections/ctaSection';
import { testimonialSection } from './schemas/objects/sections/testimonialSection';
import { newsletterSection } from './schemas/objects/sections/newsletterSection';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    product,
    productCategory,
    store,
    page,
    blogPost,
    promotion,
    person,

    // Singletons
    siteSettings,

    // Objects
    surfaceVisibility,
    seoFields,
    portableText,

    // Sections
    heroSection,
    textSection,
    featuredMenuSection,
    storeListSection,
    imageGallerySection,
    ctaSection,
    testimonialSection,
    newsletterSection,
  ],
};
