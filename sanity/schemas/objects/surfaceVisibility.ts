import {defineType, defineField} from 'sanity'

/**
 * Surface Visibility — controls which surfaces display a piece of content.
 * Used on: product, productCategory, promotion
 *
 * Convention: all flags default to true. Empty/all-true means "show everywhere".
 */
export const surfaceVisibility = defineType({
  name: 'surfaceVisibility',
  title: 'Surface Visibility',
  type: 'object',
  description: 'Control which surfaces display this content',
  fields: [
    defineField({
      name: 'website',
      title: 'Website',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'terminal',
      title: 'Order Terminal',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'displays',
      title: 'In-Store Displays',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  options: {
    columns: 3,
  },
})
