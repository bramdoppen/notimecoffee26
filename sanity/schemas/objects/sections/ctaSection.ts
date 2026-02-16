import {defineType, defineField} from 'sanity'
import {BulbOutlineIcon} from '@sanity/icons'

export const ctaSection = defineType({
  name: 'ctaSection',
  title: 'CTA Section',
  type: 'object',
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body Text',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'buttonLink',
      title: 'Button Link',
      type: 'url',
      validation: (rule) =>
        rule.uri({allowRelative: true, scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          {title: 'Primary', value: 'primary'},
          {title: 'Secondary', value: 'secondary'},
          {title: 'Dark', value: 'dark'},
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'buttonText',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'CTA Section',
        subtitle: subtitle ? `Button: ${subtitle}` : 'CTA',
      }
    },
  },
})
