import {defineType, defineField} from 'sanity'

/**
 * SEO Fields — reusable metadata object for all public-facing document types.
 * Used on: product, store, page, blogPost, siteSettings (as defaultSeo)
 */
export const seoFields = defineType({
  name: 'seoFields',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Title for search engines (recommended: 50–60 characters)',
      validation: (rule) =>
        rule.max(60).warning('Meta titles over 60 characters may be truncated in search results'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'Description for search engines (recommended: 150–160 characters)',
      validation: (rule) =>
        rule
          .max(160)
          .warning('Meta descriptions over 160 characters may be truncated in search results'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image',
      type: 'image',
      description: 'Displayed when shared on social media (recommended: 1200×630)',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      description: 'When enabled, search engines will not index this page',
      initialValue: false,
    }),
  ],
  options: {
    collapsible: true,
    collapsed: true,
  },
})
