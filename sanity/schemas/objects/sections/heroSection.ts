import {defineType, defineField} from 'sanity'
import {ImageIcon} from '@sanity/icons'

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
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
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA Button Link',
      type: 'url',
      validation: (rule) =>
        rule.uri({allowRelative: true, scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          {title: 'Full Width', value: 'full'},
          {title: 'Split Layout', value: 'split'},
          {title: 'Minimal', value: 'minimal'},
        ],
        layout: 'radio',
      },
      initialValue: 'full',
    }),
  ],
  preview: {
    select: {
      title: 'headline',
      media: 'backgroundImage',
    },
    prepare({title, media}) {
      return {
        title: title || 'Hero Section',
        subtitle: 'Hero',
        media,
      }
    },
  },
})
