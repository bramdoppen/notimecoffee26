import {PackageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Product — coffee, food, merchandise, retail beans, or any product sold.
 * Supports multi-surface visibility, price variants (S/M/L), dietary info,
 * and per-store availability.
 */
export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: PackageIcon,
  groups: [
    {name: 'details', title: 'Details', default: true},
    {name: 'pricing', title: 'Pricing'},
    {name: 'dietary', title: 'Dietary'},
    {name: 'availability', title: 'Availability'},
    {name: 'media', title: 'Media'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // --- Details ---
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required().max(100),
      group: 'details',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (rule) => rule.required(),
      group: 'details',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Full description for website and terminal',
      group: 'details',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'string',
      description: 'One-liner for displays and cards (max 80 chars)',
      validation: (rule) => rule.max(80),
      group: 'details',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'productCategory'}],
      validation: (rule) => rule.required(),
      group: 'details',
    }),

    // --- Pricing ---
    defineField({
      name: 'price',
      title: 'Base Price (€)',
      type: 'number',
      description: 'Base price in EUR',
      validation: (rule) => rule.required().positive(),
      group: 'pricing',
    }),
    defineField({
      name: 'priceVariants',
      title: 'Price Variants',
      type: 'array',
      description: 'Size variants (e.g., Small, Medium, Large)',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'price',
              title: 'Price (€)',
              type: 'number',
              validation: (rule) => rule.required().positive(),
            }),
          ],
          preview: {
            select: {title: 'label', subtitle: 'price'},
            prepare({title, subtitle}) {
              return {title, subtitle: subtitle ? `€${subtitle}` : ''}
            },
          },
        },
      ],
      group: 'pricing',
    }),

    // --- Dietary ---
    defineField({
      name: 'allergens',
      title: 'Allergens',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Gluten', value: 'gluten'},
          {title: 'Dairy', value: 'dairy'},
          {title: 'Nuts', value: 'nuts'},
          {title: 'Soy', value: 'soy'},
          {title: 'Eggs', value: 'eggs'},
          {title: 'Sesame', value: 'sesame'},
        ],
      },
      group: 'dietary',
    }),
    defineField({
      name: 'dietaryFlags',
      title: 'Dietary Flags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Vegan', value: 'vegan'},
          {title: 'Vegetarian', value: 'vegetarian'},
          {title: 'Gluten-Free', value: 'gluten-free'},
          {title: 'Sugar-Free', value: 'sugar-free'},
        ],
      },
      group: 'dietary',
    }),

    // --- Availability ---
    defineField({
      name: 'available',
      title: 'Available',
      type: 'boolean',
      description: 'Is this product currently available for sale?',
      initialValue: true,
      validation: (rule) => rule.required(),
      group: 'availability',
    }),
    defineField({
      name: 'availableAt',
      title: 'Available At',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'store'}]}],
      description: 'Leave empty for "all stores". Select specific stores to limit availability.',
      group: 'availability',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show on the landing page featured section',
      initialValue: false,
      group: 'availability',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Manual ordering within category (lower = first)',
      group: 'availability',
    }),
    defineField({
      name: 'surfaces',
      title: 'Surface Visibility',
      type: 'surfaceVisibility',
      group: 'availability',
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
  orderings: [
    {
      title: 'Name A→Z',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
    {
      title: 'Category, then Sort Order',
      name: 'categorySortOrder',
      by: [
        {field: 'category._ref', direction: 'asc'},
        {field: 'sortOrder', direction: 'asc'},
      ],
    },
    {
      title: 'Sort Order',
      name: 'sortOrder',
      by: [{field: 'sortOrder', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'name',
      categoryName: 'category.name',
      price: 'price',
      available: 'available',
      media: 'image',
    },
    prepare({title, categoryName, price, available, media}) {
      const prefix = available === false ? '🚫 ' : ''
      const priceStr = price ? ` — €${price}` : ''
      return {
        title: `${prefix}${title}`,
        subtitle: `${categoryName || 'Uncategorized'}${priceStr}`,
        media,
      }
    },
  },
})
