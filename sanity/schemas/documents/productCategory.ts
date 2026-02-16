import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Product Category — organizes products into navigable sections.
 * Separate document type (not inline string) to enable reordering,
 * icons, per-surface visibility, and consistent categorization.
 */
export const productCategory = defineType({
  name: 'productCategory',
  title: 'Product Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'e.g., "Hot Drinks", "Pastries", "Merchandise"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Emoji or icon identifier (e.g., ☕, 🥐, 👕)',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Controls display order (lower = first)',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'surfaces',
      title: 'Surface Visibility',
      type: 'surfaceVisibility',
    }),
  ],
  orderings: [
    {
      title: 'Sort Order',
      name: 'sortOrder',
      by: [{field: 'sortOrder', direction: 'asc'}],
    },
    {
      title: 'Name A→Z',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'name',
      icon: 'icon',
      media: 'image',
    },
    prepare({title, icon, media}) {
      return {
        title: icon ? `${icon} ${title}` : title,
        subtitle: 'Product Category',
        media,
      }
    },
  },
})
