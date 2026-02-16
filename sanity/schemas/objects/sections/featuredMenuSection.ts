import {defineType, defineField} from 'sanity'
import {StarIcon} from '@sanity/icons'

/**
 * Featured Menu Section — displays a curated or auto-generated grid of products.
 *
 * When autoFeatured is true, the frontend fetches products where featured == true.
 * When false, the editor manually picks items via the items array.
 */
export const featuredMenuSection = defineType({
  name: 'featuredMenuSection',
  title: 'Featured Menu Section',
  type: 'object',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Our Favorites',
    }),
    defineField({
      name: 'autoFeatured',
      title: 'Auto-populate from featured products',
      type: 'boolean',
      description:
        'When enabled, automatically shows products marked as "featured". When disabled, use the manual list below.',
      initialValue: true,
    }),
    defineField({
      name: 'items',
      title: 'Manual Product Selection',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'product'}]}],
      hidden: ({parent}) => parent?.autoFeatured === true,
      description: 'Manually select products to feature (only used when auto-populate is off)',
    }),
    defineField({
      name: 'maxItems',
      title: 'Max Items to Display',
      type: 'number',
      initialValue: 6,
      validation: (rule) => rule.min(1).max(12).integer(),
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      autoFeatured: 'autoFeatured',
    },
    prepare({title, autoFeatured}) {
      return {
        title: title || 'Featured Menu',
        subtitle: autoFeatured ? 'Auto-populated' : 'Manual selection',
      }
    },
  },
})
