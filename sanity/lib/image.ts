import createImageUrlBuilder from '@sanity/image-url';
import { dataset, projectId } from '@/sanity/env';

const builder = createImageUrlBuilder({ projectId, dataset });

// Accept any Sanity image source — reference, expanded asset, or image object.
// The @sanity/image-url builder handles all forms internally.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source);
}
