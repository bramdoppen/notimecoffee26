import createImageUrlBuilder from '@sanity/image-url';
import { dataset, projectId } from '@/sanity/env';

const builder = createImageUrlBuilder({ projectId, dataset });

// Placeholder for missing images — 1x1 transparent PNG data URI
const PLACEHOLDER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// Accept any Sanity image source — reference, expanded asset, or image object.
// Returns a builder with .width()/.height()/.url() etc.
// If source is null/undefined, returns a stub that produces a placeholder URL.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  if (!source) {
    // Return a chainable stub that always resolves to a placeholder
    const stub = {
      width: () => stub,
      height: () => stub,
      fit: () => stub,
      crop: () => stub,
      auto: () => stub,
      format: () => stub,
      quality: () => stub,
      url: () => PLACEHOLDER_IMAGE,
    };
    return stub as unknown as ReturnType<typeof builder.image>;
  }
  return builder.image(source);
}
