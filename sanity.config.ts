import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import {
  presentationTool,
  defineDocuments,
  defineLocations,
  type DocumentLocation,
} from 'sanity/presentation';
import { schema } from '@/sanity/schema';
import { structure } from '@/sanity/structure';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const previewUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const homeLocation = {
  title: 'Home',
  href: '/',
} satisfies DocumentLocation;

function resolveHref(
  documentType?: string,
  slug?: string
): string | undefined {
  switch (documentType) {
    case 'page':
      return slug === 'home' ? '/' : slug ? `/${slug}` : undefined;
    case 'property':
      return slug ? `/woningen/${slug}` : undefined;
    default:
      return undefined;
  }
}

export default defineConfig({
  name: 'aankoopmakelaar',
  title: 'Aankoopmakelaar',
  projectId,
  dataset,
  plugins: [
    presentationTool({
      previewUrl: {
        origin: previewUrl,
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },
      resolve: {
        mainDocuments: defineDocuments([
          {
            route: '/',
            filter: `_type == "page" && slug.current == "home"`,
          },
          {
            route: '/:slug',
            filter: `_type == "page" && slug.current == $slug`,
          },
          {
            route: '/woningen/:slug',
            filter: `_type == "property" && slug.current == $slug`,
          },
        ]),
        locations: {
          siteSettings: defineLocations({
            locations: [homeLocation],
            message: 'Dit document wordt op alle pagina\'s gebruikt',
            tone: 'positive',
          }),
          page: defineLocations({
            select: { title: 'title', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled',
                  href: resolveHref('page', doc?.slug)!,
                },
              ],
            }),
          }),
          property: defineLocations({
            select: { title: 'address', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Woning',
                  href: resolveHref('property', doc?.slug)!,
                },
                homeLocation,
              ].filter(Boolean) as DocumentLocation[],
            }),
          }),
        },
      },
    }),
    structureTool({ structure }),
    visionTool(),
  ],
  schema,
});
