import {defineType, defineField} from 'sanity'
import {CommentIcon} from '@sanity/icons'

export const testimonialSection = defineType({
  name: 'testimonialSection',
  title: 'Testimonial Section',
  type: 'object',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'What People Say',
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'quote',
              title: 'Quote',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'author',
              title: 'Author',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'role',
              title: 'Role / Title',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              title: 'author',
              subtitle: 'quote',
            },
            prepare({title, subtitle}) {
              return {
                title: title || 'Anonymous',
                subtitle: subtitle
                  ? `"${subtitle.length > 60 ? subtitle.slice(0, 60) + '…' : subtitle}"`
                  : '',
              }
            },
          },
        },
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      testimonials: 'testimonials',
    },
    prepare({title, testimonials}) {
      return {
        title: title || 'Testimonials',
        subtitle: `${testimonials?.length || 0} testimonials`,
      }
    },
  },
})
