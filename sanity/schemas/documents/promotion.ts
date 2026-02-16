import {StarIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Promotion — promotional content for displays, website banners, and terminals.
 * Future-ready: included now so editors can prep content early for Phase 2/3.
 */
export const promotion = defineType({
  name: 'promotion',
  title: 'Promotion',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      description: 'For internal reference only — not displayed publicly',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      description: 'Display headline shown to customers',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'products',
      title: 'Featured Products',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'product'}]}],
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'datetime',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'datetime',
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'stores',
      title: 'Stores',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'store'}]}],
      description: 'Leave empty for "all stores". Select specific stores to limit.',
    }),
    defineField({
      name: 'surfaces',
      title: 'Surface Visibility',
      type: 'surfaceVisibility',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      headline: 'headline',
      active: 'active',
      media: 'image',
    },
    prepare({title, headline, active, media}) {
      const prefix = active ? '🟢' : '🔴'
      return {
        title: `${prefix} ${title}`,
        subtitle: headline,
        media,
      }
    },
  },
})
