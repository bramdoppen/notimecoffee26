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
    case 'blogPost':
      return slug ? `/blog/${slug}` : undefined;
    case 'product':
      return slug ? `/menu/${slug}` : undefined;
    case 'store':
      return slug ? `/locations/${slug}` : undefined;
    default:
      return undefined;
  }
}

export default defineConfig({
  name: 'notimecoffee',
  title: 'No Time Coffee',
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
            route: '/blog/:slug',
            filter: `_type == "blogPost" && slug.current == $slug`,
          },
          {
            route: '/menu/:slug',
            filter: `_type == "product" && slug.current == $slug`,
          },
          {
            route: '/locations/:slug',
            filter: `_type == "store" && slug.current == $slug`,
          },
        ]),
        locations: {
          siteSettings: defineLocations({
            locations: [homeLocation],
            message: 'This document is used on all pages',
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
          blogPost: defineLocations({
            select: { title: 'title', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled',
                  href: resolveHref('blogPost', doc?.slug)!,
                },
                homeLocation,
              ].filter(Boolean) as DocumentLocation[],
            }),
          }),
          product: defineLocations({
            select: { title: 'name', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled',
                  href: resolveHref('product', doc?.slug)!,
                },
              ],
            }),
          }),
          store: defineLocations({
            select: { title: 'name', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled',
                  href: resolveHref('store', doc?.slug)!,
                },
              ],
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
