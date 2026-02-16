import {defineType, defineField} from 'sanity'
import {ImagesIcon} from '@sanity/icons'

export const imageGallerySection = defineType({
  name: 'imageGallerySection',
  title: 'Image Gallery Section',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
          ],
        },
      ],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Grid', value: 'grid'},
          {title: 'Carousel', value: 'carousel'},
          {title: 'Masonry', value: 'masonry'},
        ],
        layout: 'radio',
      },
      initialValue: 'grid',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      images: 'images',
    },
    prepare({title, images}) {
      return {
        title: title || 'Image Gallery',
        subtitle: `${images?.length || 0} images — Gallery`,
      }
    },
  },
})
