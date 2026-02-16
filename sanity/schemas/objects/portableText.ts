import {defineType, defineField, defineArrayMember} from 'sanity'
import {HomeIcon, PlayIcon} from '@sanity/icons'

/**
 * Portable Text — rich text with custom embed blocks.
 * Used in: page sections and anywhere rich content is needed.
 *
 * Custom blocks:
 * - propertyEmbed: inline property card (reference → property)
 * - ctaButton: styled call-to-action button
 */
export const portableText = defineType({
  name: 'portableText',
  title: 'Rich Text',
  type: 'array',
  of: [
    // Standard block content
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
          {title: 'Underline', value: 'underline'},
          {title: 'Strikethrough', value: 'strike-through'},
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                validation: (rule) =>
                  rule.uri({
                    allowRelative: true,
                    scheme: ['http', 'https', 'mailto', 'tel'],
                  }),
              }),
              defineField({
                name: 'openInNewTab',
                title: 'Open in new tab',
                type: 'boolean',
                initialValue: false,
              }),
            ],
          },
        ],
      },
    }),

    // Inline image
    defineArrayMember({
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Required for accessibility',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
        }),
      ],
    }),

    // Property embed — renders as compact PropertyCard
    defineArrayMember({
      name: 'propertyEmbed',
      title: 'Woning Embed',
      type: 'object',
      icon: HomeIcon,
      fields: [
        defineField({
          name: 'property',
          title: 'Woning',
          type: 'reference',
          to: [{type: 'property'}],
          validation: (rule) => rule.required(),
        }),
      ],
      preview: {
        select: {
          title: 'property.address',
          subtitle: 'property.city',
          media: 'property.mainImage',
        },
        prepare({title, subtitle, media}) {
          return {
            title: title || 'Geen woning geselecteerd',
            subtitle: subtitle || 'Woning Embed',
            media,
          }
        },
      },
    }),

    // CTA button — renders as styled Button component
    defineArrayMember({
      name: 'ctaButton',
      title: 'CTA Button',
      type: 'object',
      icon: PlayIcon,
      fields: [
        defineField({
          name: 'text',
          title: 'Button Text',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'url',
          title: 'URL',
          type: 'url',
          validation: (rule) =>
            rule.uri({
              allowRelative: true,
              scheme: ['http', 'https', 'mailto', 'tel'],
            }),
        }),
        defineField({
          name: 'style',
          title: 'Style',
          type: 'string',
          options: {
            list: [
              {title: 'Primary', value: 'primary'},
              {title: 'Secondary', value: 'secondary'},
              {title: 'Outline', value: 'outline'},
            ],
            layout: 'radio',
          },
          initialValue: 'primary',
        }),
      ],
      preview: {
        select: {
          title: 'text',
          subtitle: 'url',
        },
        prepare({title, subtitle}) {
          return {
            title: title || 'CTA Button',
            subtitle: subtitle || 'No URL set',
          }
        },
      },
    }),
  ],
})
