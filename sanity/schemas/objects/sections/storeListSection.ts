import {defineType, defineField} from 'sanity'
import {PinIcon} from '@sanity/icons'

export const storeListSection = defineType({
  name: 'storeListSection',
  title: 'Store List Section',
  type: 'object',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Our Locations',
    }),
    defineField({
      name: 'showMap',
      title: 'Show Map',
      type: 'boolean',
      description: 'Display an interactive map alongside the store list',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'heading',
    },
    prepare({title}) {
      return {
        title: title || 'Store List',
        subtitle: 'Stores',
      }
    },
  },
})
