import {defineType, defineField} from 'sanity'
import {EnvelopeIcon} from '@sanity/icons'

export const newsletterSection = defineType({
  name: 'newsletterSection',
  title: 'Newsletter Section',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Stay in the Loop',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      initialValue: 'Subscribe',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
    },
    prepare({title}) {
      return {
        title: title || 'Newsletter',
        subtitle: 'Newsletter Signup',
      }
    },
  },
})
