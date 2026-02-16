import {PinIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Store — physical locations with hours, features, and coordinates.
 * Supports opening hours per day, special hours (holidays), and store features.
 */
export const store = defineType({
  name: 'store',
  title: 'Store',
  type: 'document',
  icon: PinIcon,
  groups: [
    {name: 'info', title: 'Info', default: true},
    {name: 'hours', title: 'Hours'},
    {name: 'media', title: 'Media'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // --- Info ---
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'info',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (rule) => rule.required(),
      group: 'info',
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      options: {
        list: [
          {title: 'Amsterdam', value: 'amsterdam'},
          {title: 'Arnhem', value: 'arnhem'},
          {title: 'Den Haag', value: 'den-haag'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
      group: 'info',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
      group: 'info',
    }),
    defineField({
      name: 'zipCode',
      title: 'Zip Code',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'info',
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordinates',
      type: 'geopoint',
      description: 'Used for map display and directions',
      validation: (rule) => rule.required(),
      group: 'info',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      group: 'info',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) =>
        rule.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {name: 'email', invert: false}).warning(
          'Please enter a valid email address'
        ),
      group: 'info',
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'WiFi', value: 'wifi'},
          {title: 'Terrace', value: 'terrace'},
          {title: 'Wheelchair Accessible', value: 'wheelchair'},
          {title: 'Bike Parking', value: 'bike-parking'},
          {title: 'Power Outlets', value: 'power-outlets'},
          {title: 'Dog Friendly', value: 'dog-friendly'},
          {title: 'Takeaway', value: 'takeaway'},
          {title: 'Dine-In', value: 'dine-in'},
        ],
      },
      group: 'info',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'portableText',
      group: 'info',
    }),

    // --- Hours ---
    defineField({
      name: 'hours',
      title: 'Opening Hours',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'dayHours',
          fields: [
            defineField({
              name: 'day',
              title: 'Day',
              type: 'string',
              options: {
                list: [
                  {title: 'Monday', value: 'monday'},
                  {title: 'Tuesday', value: 'tuesday'},
                  {title: 'Wednesday', value: 'wednesday'},
                  {title: 'Thursday', value: 'thursday'},
                  {title: 'Friday', value: 'friday'},
                  {title: 'Saturday', value: 'saturday'},
                  {title: 'Sunday', value: 'sunday'},
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'open',
              title: 'Open',
              type: 'string',
              description: 'e.g., 08:00',
              hidden: ({parent}) => parent?.closed === true,
            }),
            defineField({
              name: 'close',
              title: 'Close',
              type: 'string',
              description: 'e.g., 18:00',
              hidden: ({parent}) => parent?.closed === true,
            }),
            defineField({
              name: 'closed',
              title: 'Closed',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              day: 'day',
              open: 'open',
              close: 'close',
              closed: 'closed',
            },
            prepare({day, open, close, closed}) {
              const dayLabel = day ? day.charAt(0).toUpperCase() + day.slice(1) : 'Day'
              return {
                title: dayLabel,
                subtitle: closed ? 'Closed' : `${open || '?'} – ${close || '?'}`,
              }
            },
          },
        },
      ],
      validation: (rule) => rule.required().min(7).max(7),
      group: 'hours',
    }),
    defineField({
      name: 'specialHours',
      title: 'Special Hours',
      type: 'array',
      description: 'Holiday or event hour overrides',
      of: [
        {
          type: 'object',
          name: 'specialHoursEntry',
          fields: [
            defineField({
              name: 'date',
              title: 'Date',
              type: 'date',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'e.g., "Christmas", "King\'s Day"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'open',
              title: 'Open',
              type: 'string',
              hidden: ({parent}) => parent?.closed === true,
            }),
            defineField({
              name: 'close',
              title: 'Close',
              type: 'string',
              hidden: ({parent}) => parent?.closed === true,
            }),
            defineField({
              name: 'closed',
              title: 'Closed',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              date: 'date',
              label: 'label',
              closed: 'closed',
              open: 'open',
              close: 'close',
            },
            prepare({date, label, closed, open, close}) {
              return {
                title: label || 'Special Hours',
                subtitle: closed ? `${date} — Closed` : `${date} — ${open || '?'} – ${close || '?'}`,
              }
            },
          },
        },
      ],
      group: 'hours',
    }),

    // --- Media ---
    defineField({
      name: 'image',
      title: 'Main Image',
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
      validation: (rule) => rule.required(),
      group: 'media',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
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
          ],
        },
      ],
      group: 'media',
    }),

    // --- SEO ---
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'city',
      media: 'image',
    },
  },
})
