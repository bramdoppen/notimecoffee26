import {DocumentTextIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Blog Post — content marketing, brewing guides, origin stories, events.
 * Uses portableText for rich body content with product/store embeds.
 */
export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'meta', title: 'Meta'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // --- Content ---
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
        aiAssist: {imageDescriptionField: 'alt'},
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Important for SEO and accessibility',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Short summary for listings and SEO (max 200 characters)',
      validation: (rule) => rule.required().max(200),
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'portableText',
      validation: (rule) => rule.required(),
      group: 'content',
    }),

    // --- Meta ---
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'meta',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
      group: 'meta',
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Coffee', value: 'coffee'},
          {title: 'Recipes', value: 'recipes'},
          {title: 'News', value: 'news'},
          {title: 'Sustainability', value: 'sustainability'},
          {title: 'Behind the Scenes', value: 'behind-the-scenes'},
          {title: 'Events', value: 'events'},
        ],
      },
      group: 'meta',
    }),
    defineField({
      name: 'relatedPosts',
      title: 'Related Posts',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'blogPost'}]}],
      validation: (rule) => rule.max(3),
      group: 'meta',
    }),

    // --- SEO ---
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
      group: 'seo',
    }),
  ],
  orderings: [
    {
      title: 'Published (Newest)',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Published (Oldest)',
      name: 'publishedAtAsc',
      by: [{field: 'publishedAt', direction: 'asc'}],
    },
    {
      title: 'Title A→Z',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author',
      date: 'publishedAt',
      media: 'mainImage',
    },
    prepare({title, author, date, media}) {
      const dateStr = date
        ? new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : ''
      const subtitleParts = [author, dateStr].filter(Boolean)
      return {
        title: title || 'Untitled Post',
        subtitle: subtitleParts.join(' — '),
        media,
      }
    },
  },
})
