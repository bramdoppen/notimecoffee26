import {defineType, defineField} from 'sanity'
import {TextIcon} from '@sanity/icons'

export const textSection = defineType({
  name: 'textSection',
  title: 'Text Section',
  type: 'object',
  icon: TextIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'portableText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'alignment',
      title: 'Text Alignment',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Center', value: 'center'},
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
    },
    prepare({title}) {
      return {
        title: title || 'Text Section',
        subtitle: 'Text',
      }
    },
  },
})
